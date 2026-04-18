// Jeal.AI — Audit quiz data + tiers
window.QUESTIONS = [
  { id:'q1', category:'LEAD RESPONSE',
    text:'How quickly are new leads contacted after they come in?',
    options:[
      {label:'Within minutes — handled automatically', score:3},
      {label:'Within an hour — someone checks regularly', score:2},
      {label:'A few hours or same day', score:1},
      {label:"Days later, or it's inconsistent", score:0}
    ],
    leakName:'Slow Lead Response',
    leakDesc:'New leads are not being reached fast enough. Speed to contact is one of the biggest factors in conversion.',
    quickWin:'Set up an instant lead notification with an automated first-touch message. Most lost leads are gone in the first 5 minutes.'
  },
  { id:'q2', category:'FOLLOW-UP',
    text:'How often do leads go cold with no follow-up?',
    options:[
      {label:'Rarely — our system handles follow-up', score:3},
      {label:'Sometimes — we follow up manually when we remember', score:2},
      {label:'Often — it falls through the cracks', score:1},
      {label:'Frequently — no real follow-up system', score:0}
    ],
    leakName:'Follow-Up Gaps',
    leakDesc:'Leads are slipping through without consistent follow-up. Most deals close on contact 4 or 5. Without a system those never happen.',
    quickWin:'Build a 5-step follow-up sequence that runs on its own. Consistency closes deals.'
  },
  { id:'q3', category:'PIPELINE VISIBILITY',
    text:'Do you know where leads drop off in your process?',
    options:[
      {label:'Yes — full visibility into every stage', score:3},
      {label:'Partial — we track some stages', score:2},
      {label:'Not really — a rough idea', score:1},
      {label:'No — no tracking in place', score:0}
    ],
    leakName:'No Pipeline Visibility',
    leakDesc:"Without visibility into where leads drop off, you can't improve. Every blind spot is a revenue leak.",
    quickWin:"Set up a simple pipeline view so you see every lead's stage. You can't fix what you can't see."
  },
  { id:'q4', category:'SCHEDULING',
    text:'How are appointments or consultations scheduled?',
    options:[
      {label:'Fully handled — booking links, confirmations, reminders', score:3},
      {label:'Online booking, but manually managed', score:2},
      {label:'We call or email back to schedule', score:1},
      {label:'Back-and-forth texting or phone tag', score:0}
    ],
    leakName:'Scheduling Friction',
    leakDesc:'Manual scheduling creates delays and drop-off. Every extra step between interest and appointment costs you deals.',
    quickWin:'Replace phone tag with a booking link that sends automatic confirmations and reminders.'
  },
  { id:'q5', category:'SALES PROCESS',
    text:'How consistent is your sales process across your team?',
    options:[
      {label:'Very consistent — everyone follows the same steps', score:3},
      {label:'Mostly consistent — small variations', score:2},
      {label:'It varies by rep', score:1},
      {label:"We don't have a defined process", score:0}
    ],
    leakName:'Inconsistent Sales Process',
    leakDesc:"When each rep does it differently, results are unpredictable. Your best rep's process should be everyone's process.",
    quickWin:"Document what your best rep does and build it into a standard workflow."
  },
  { id:'q6', category:'MISSED INQUIRIES',
    text:'What happens when a call or inquiry is missed?',
    options:[
      {label:'An instant message goes out automatically', score:3},
      {label:'Someone follows up the same day', score:2},
      {label:'Usually caught, but delayed', score:1},
      {label:'It often goes unaddressed', score:0}
    ],
    leakName:'Missed Inquiry Drain',
    leakDesc:"Every missed inquiry that goes unanswered is a potential customer walking to a competitor.",
    quickWin:'Set up an automatic missed-call text-back.'
  },
  { id:'q7', category:'CONVERSION TRACKING',
    text:'Do you track conversion rates from lead to customer?',
    options:[
      {label:'Yes — clearly and regularly', score:3},
      {label:'Loosely — rough estimates', score:2},
      {label:'Not actively', score:1},
      {label:'Not at all', score:0}
    ],
    leakName:'Invisible Conversion Funnel',
    leakDesc:"Not measuring conversions means you're guessing what works.",
    quickWin:'Start tracking lead-to-customer conversion weekly.'
  },
  { id:'q8', category:'LEAD HANDLING',
    text:'What happens after a new lead comes in?',
    options:[
      {label:'They enter a structured pipeline with clear next steps', score:3},
      {label:'Someone manually reviews and follows up', score:2},
      {label:'It varies depending on who sees it first', score:1},
      {label:"It's unclear — no consistent process", score:0}
    ],
    leakName:'Unstructured Lead Handling',
    leakDesc:"Results depend entirely on who happens to see it. That's not a system, it's luck.",
    quickWin:'Map out a clear pipeline with defined stages and owners.'
  },
  { id:'q9', category:'LEAD SOURCES',
    text:'Where do most of your leads come from?',
    options:[
      {label:'Paid ads (Facebook, Google, etc.)', score:null},
      {label:'Referrals and word of mouth', score:null},
      {label:'Organic / website / SEO', score:null},
      {label:'Mixed or unclear', score:null}
    ]
  },
  { id:'q10', category:'BIGGEST CHALLENGE',
    text:"What's your biggest challenge right now?",
    options:[
      {label:'Slow response to new leads', score:null},
      {label:'Low conversion rate', score:null},
      {label:'Leads going cold without follow-up', score:null},
      {label:'No clear tracking or reporting', score:null}
    ]
  }
];

window.TIERS = [
  { min:20, max:24, label:'Strong Foundation', color:'#0B94D3',
    title:'Your systems are working.',
    body:'You have solid fundamentals in place. The focus now is optimization — small improvements at each stage compound into significant revenue gains.',
    opps:[
      'Fine-tune follow-up timing and message quality to improve conversion rates',
      'Add lead scoring to prioritize the highest-intent prospects',
      'Build reporting dashboards to spot bottlenecks before they become problems'
    ]},
  { min:14, max:19, label:'Needs Attention', color:'#F5A524',
    title:'You have gaps that are costing you.',
    body:'Some of your systems are working, but the gaps in between are where deals get lost. Targeted fixes in 2–3 areas will move the needle fast.',
    opps:[
      "Standardize your sales process so your best approach is everyone's approach",
      'Add pipeline visibility so you can see and fix where leads drop off',
      'Automate scheduling to cut friction and speed up the sales cycle'
    ]},
  { min:7, max:13, label:'Revenue Leaks Present', color:'#E8692A',
    title:'Significant gaps in your pipeline.',
    body:'Your business is actively losing revenue through slow response, missing follow-up, and inconsistent processes. These are fixable, but every week without a fix costs you.',
    opps:[
      'Implement a speed-to-lead response under 5 minutes for every new inquiry',
      'Build a structured follow-up sequence that runs without manual effort',
      'Create a CRM pipeline to track every lead from first contact to close'
    ]},
  { min:0, max:6, label:'Critical Gaps', color:'#EF4A4A',
    title:'Your pipeline is losing most of what comes in.',
    body:'The gaps identified are significant. Most leads are being lost before they ever have a chance to become customers. The fixes exist, and are not as complex as you might think.',
    opps:[
      'Start with a simple CRM to replace spreadsheets and sticky notes',
      'Set up instant lead response so no inquiry goes more than 5 minutes without a reply',
      'Build a basic 3-step follow-up sequence for every new lead'
    ]}
];
