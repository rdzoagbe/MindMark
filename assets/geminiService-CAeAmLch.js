import{G as s}from"./index-otSsRz90.js";const r=new s({apiKey:""}),a={async summarizeMeeting(t){if(!t.trim())return"No conversation detected.";try{return(await r.models.generateContent({model:"gemini-3-flash-preview",contents:`You are an expert executive assistant. Summarize the following meeting transcript into a concise format:
        1. **Key Decisions**
        2. **Action Items** (with owners if mentioned)
        3. **Important Mentions**
        
        Transcript:
        ${t}`})).text}catch(e){throw console.error("Gemini summarization error:",e),e}},async extractImportantTopics(t){var e;try{return((e=(await r.models.generateContent({model:"gemini-3-flash-preview",contents:`Extract the top 5 important topics or keywords from this conversation as a comma-separated list:
        ${t}`})).text)==null?void 0:e.split(",").map(n=>n.trim()))||[]}catch(o){return console.error("Gemini topic extraction error:",o),[]}},async generateResumeStrategy(t){try{return(await r.models.generateContent({model:"gemini-3-flash-preview",contents:`You are a productivity expert. Given this session context, provide a "Smart Resume Strategy" to help the user get back into deep flow:
        
        Session: ${t.title}
        Current Task: ${t.currentTask}
        Next Step: ${t.nextStep}
        Notes: ${t.notes}
        
        Give 3 punchy points to resume.`})).text}catch(e){return console.error("Resume strategy error:",e),"Flow strategy not available right now. Just focus on the next step!"}},async generateLinkSummary(t){try{return(await r.models.generateContent({model:"gemini-3-flash-preview",contents:`Briefly summarize the context of these URLs for a productivity session: ${t.join(", ")}`})).text}catch(e){return console.error("Link summary error:",e),"Contextual summary not available."}}};export{a as g};
