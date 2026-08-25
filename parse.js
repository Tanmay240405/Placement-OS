const fs = require('fs');

const data = fs.readFileSync('TopicsAndSubtopics', 'utf8');
const lines = data.split('\n');

const result = {};
let currentSubjectKey = null;
let currentTopic = null;

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const subjectKeyMap = {
  "dbms": "dbms",
  "sql": "sql",
  "computer networks": "cn",
  "operating systems": "os",
  "oops": "oops",
  "system architecture and design": "system-design"
};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // Skip notes or comments in the file that are not structured
  if (line.match(/^(Extremely|Very|Important|Also|You should|For each|Practice|Make this)/i)) continue;
  if (line.match(/must know/i)) continue;

  const subjectMatch = line.match(/^(\d+)\.\s+([A-Za-z\s&]+)$/);
  if (subjectMatch) {
    const rawSubject = subjectMatch[2].trim().toLowerCase();
    
    let key = slugify(rawSubject);
    if (rawSubject.includes("computer networks")) key = "cn";
    else if (rawSubject.includes("operating systems")) key = "os";
    else if (rawSubject.includes("oops")) key = "oops";
    else if (rawSubject.includes("system architecture")) key = "system-design";
    else if (rawSubject.includes("dbms")) key = "dbms";
    else if (rawSubject.includes("sql")) key = "sql";
    
    currentSubjectKey = key;
    
    result[currentSubjectKey] = {
      title: subjectMatch[2].trim(),
      topics: []
    };
    currentTopic = null;
    continue;
  }
  
  const topicMatch = line.match(/^(\d+\.\d+)\s+(.+)$/);
  if (topicMatch) {
    if (!currentSubjectKey) continue;
    
    currentTopic = {
      id: topicMatch[1],
      title: topicMatch[2].trim(),
      subtopics: []
    };
    result[currentSubjectKey].topics.push(currentTopic);
    continue;
  }
  
  // Subtopic
  if (currentTopic && currentSubjectKey) {
    currentTopic.subtopics.push(line);
  }
}

// Make sure the directory exists
const dir = './src/data';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync('./src/data/topics.json', JSON.stringify(result, null, 2));
console.log("Parsed topics and saved to src/data/topics.json");
