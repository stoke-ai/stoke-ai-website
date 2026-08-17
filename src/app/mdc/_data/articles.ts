export type Article = {
  slug: string;
  keyword: string;
  title: string;
  description: string;
  dek: string;
  readTime: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  related: { label: string; href: string }[];
};

export const articles: Article[] = [
  {
    slug: "broken-garage-door-spring-burley-id",
    keyword: "broken garage door spring Burley ID",
    title: "Broken Garage Door Spring in Burley? What to Do Before You Call",
    description: "Heard a loud bang or found a garage door that will not open? Learn the safe next steps for a broken garage door spring in Burley and the Magic Valley.",
    dek: "A broken spring is one of the most common—and most dangerous—garage door failures. Here is how to recognize it, protect the opener, and get the right help.",
    readTime: "5 min read",
    sections: [
      {
        heading: "First: stop operating the door",
        paragraphs: [
          "If you heard a sharp bang from the garage and the door now feels extremely heavy or opens only a few inches, a spring may have broken. Stop pressing the opener. The spring system counterbalances the weight of the door; without it, the opener may be trying to lift far more weight than it was designed to handle.",
          "Do not pull the emergency release and do not attempt to wind, stretch, clamp, or replace a spring yourself. Garage door springs and connected bottom fixtures can store or transfer enough force to cause severe injury.",
        ],
        bullets: ["Keep people and pets away from the door", "Leave the door closed if it is already closed", "Do not stand beneath a partially open door", "Call a trained garage door technician"],
      },
      {
        heading: "Signs the spring—not the opener—is the problem",
        paragraphs: [
          "Homeowners often assume the motor has failed because the opener hums or stops. A visible gap in a torsion spring above the door is a strong clue. Other signs include a door that suddenly feels too heavy to lift, cables that look loose, or the top section bending as the opener pulls.",
          "A technician checks the complete counterbalance system rather than replacing a part based on sound alone. Cable condition, drums, bearings, shaft alignment, door weight, and the second spring on a paired system all affect the correct repair.",
        ],
      },
      {
        heading: "Can the door be opened before repair?",
        paragraphs: [
          "That depends on the door, its position, and the failure. A trained technician may be able to make the system safe and move it. A homeowner should not attempt to muscle up a heavy door or prop it open. If a vehicle is trapped, say that when you call so the service team understands the urgency.",
          "Same-day garage door repair may be available in Burley, Rupert, Heyburn, Twin Falls, and surrounding Magic Valley communities. Availability depends on location, call volume, door type, and the correct spring or parts.",
        ],
      },
      {
        heading: "What a professional spring repair should include",
        paragraphs: [
          "The right spring must match the door's weight and configuration. After replacement, the technician should verify balance, cable tracking, hardware condition, opener connection, travel, and applicable safety functions. A spring swap without a system check can leave the original cause—or a second developing problem—untouched.",
          "When you call Morgan Door, describe the door size if known, whether you see one or two springs, the door's current position, and whether a vehicle is blocked. Photos can help, but they are not required to start the conversation.",
        ],
      },
    ],
    related: [
      { label: "Garage door repair in Burley and the Magic Valley", href: "/mdc/garage-door-repair" },
      { label: "Request a repair quote", href: "/mdc/free-quote" },
      { label: "Maintenance and safety checks", href: "/mdc/maintenance-safety-checks" },
    ],
  },
  {
    slug: "noisy-garage-door-magic-valley",
    keyword: "noisy garage door repair Magic Valley",
    title: "Why Is My Garage Door So Noisy? A Magic Valley Homeowner’s Guide",
    description: "Grinding, squeaking, popping, or scraping garage door? Learn what each sound can mean and when Magic Valley homeowners should stop using the door.",
    dek: "Garage doors rarely become noisy for no reason. The sound can help narrow the problem—but some noises call for an immediate stop.",
    readTime: "6 min read",
    sections: [
      {
        heading: "Listen for the type and location of the sound",
        paragraphs: [
          "A steady squeak at each hinge is different from a sharp pop above the door or a grinding operator. Note whether the sound happens while opening, closing, or both, and whether the door shakes, slows, or moves unevenly.",
          "Cold temperatures in Southern Idaho can make marginal lubrication, stiff seals, and worn rollers more noticeable. Wind-blown dust can also collect around tracks and hardware. Weather may expose the weakness, but it is not always the root cause.",
        ],
        bullets: ["Squeaking: dry or worn moving points", "Grinding: operator, rollers, bearings, or binding", "Popping: hardware movement, sections, or spring-related issues", "Scraping: track contact, bent hardware, or misalignment", "Rattling: loose fasteners or worn components"],
      },
      {
        heading: "What homeowners can safely check",
        paragraphs: [
          "With the door closed, look for obvious loose fasteners, debris near the track, damaged weather seal, or a roller that is visibly out of position. Follow the manufacturer instructions for any homeowner lubrication. Use only the recommended product and points.",
          "Do not loosen hardware attached to springs, cables, bottom brackets, drums, or the counterbalance system. Do not put hands into section joints or track paths. If the door is crooked, off track, hanging, or unusually heavy, stop operating it.",
        ],
      },
      {
        heading: "When noise means call now",
        paragraphs: [
          "Call promptly if noise appears with uneven travel, a frayed or loose cable, a visible spring gap, an off-track roller, a section pulling apart, or a door that reverses unexpectedly. Continuing to cycle the door can turn a serviceable part into damaged panels, track, or an operator failure.",
          "A professional inspection considers the door and opener as one system: balance, spring condition, rollers, hinges, bearings, fasteners, track, seals, limits, force, and safety functions.",
        ],
      },
      {
        heading: "Do not wait for the annual tune-up if behavior changes",
        paragraphs: [
          "Annual maintenance is a useful baseline, but a new sound or change in travel deserves attention when it appears. The goal is not a silent door at any cost; it is smooth, controlled, correctly balanced operation without developing wear being ignored.",
          "Morgan Door services all major brands across Burley, Twin Falls, Rupert, Kimberly, and the Magic Valley. Describe the sound and behavior when requesting service—the detail helps the team prepare.",
        ],
      },
    ],
    related: [
      { label: "Schedule a garage door safety check", href: "/mdc/maintenance-safety-checks" },
      { label: "All-brand garage door repair", href: "/mdc/garage-door-repair" },
      { label: "Get a free quote", href: "/mdc/free-quote" },
    ],
  },
  {
    slug: "garage-door-winter-prep-magic-valley",
    keyword: "garage door winter maintenance Magic Valley",
    title: "Magic Valley Garage Door Winter Prep: A Practical Homeowner Checklist",
    description: "Prepare your garage door for Southern Idaho winter with a practical checklist for seals, balance, hardware, sensors, and safe operation.",
    dek: "Cold mornings, wind, drifting dust, and temperature swings expose weak seals and worn hardware. A short fall check can prevent a badly timed winter breakdown.",
    readTime: "7 min read",
    sections: [
      {
        heading: "Check the bottom and perimeter seals",
        paragraphs: [
          "Close the door during daylight and look for light along the bottom and sides. A hardened, split, or missing bottom seal can admit cold air, moisture, dust, and pests. Side and top weatherstripping should contact the door without folding so tightly that it binds.",
          "Seals are only part of the answer. A crooked door, uneven floor, damaged section, or poor track alignment can create gaps that new weatherstrip will not solve.",
        ],
      },
      {
        heading: "Watch and listen through a complete cycle",
        paragraphs: [
          "Stand inside the garage at a safe distance and operate the door once. Look for shaking, hesitation, uneven movement, rubbing, or a sudden change in sound. Winter is hard on a door that is already unbalanced or dragging.",
          "If the opener strains, the door feels heavy, or travel has changed, schedule service before freezing weather makes access more urgent.",
        ],
        bullets: ["Door remains level while moving", "Rollers stay in track", "Cables appear seated and even", "Sections do not separate or rub", "The opener does not strain or chatter"],
      },
      {
        heading: "Clean sensor areas and verify safe closing",
        paragraphs: [
          "Photo-eye lenses near the floor can collect dust and may be bumped out of alignment. Gently clean the lens according to the opener instructions and keep storage, snow tools, and cords clear of the beam.",
          "Use the manufacturer-approved procedure to test safety reversal and photo eyes. If a door will not reverse correctly, stop regular use and call for service. Never defeat or bypass a safety device to keep the door running.",
        ],
      },
      {
        heading: "Leave spring and cable work to trained technicians",
        paragraphs: [
          "You can visually note rust, fraying, gaps, or loose-looking components from a safe distance, but do not touch or adjust the counterbalance system. Springs, cables, drums, and bottom fixtures can be under dangerous tension even when the door is closed.",
          "A professional winter-prep inspection can check balance, hardware, rollers, track, seals, opener settings, and safety functions. For attached garages or workspaces, it is also a good time to discuss whether an insulated replacement door would materially improve comfort.",
        ],
      },
    ],
    related: [
      { label: "Book maintenance and a safety check", href: "/mdc/maintenance-safety-checks" },
      { label: "Compare insulated Raynor and Hörmann garage doors", href: "/mdc/garage-door-installation" },
      { label: "Request a quote", href: "/mdc/free-quote" },
    ],
  },
  {
    slug: "garage-door-opener-problems-twin-falls",
    keyword: "garage door opener repair Twin Falls ID",
    title: "Garage Door Opener Problems in Twin Falls: Repair the Opener or the Door?",
    description: "Garage door opener not working in Twin Falls? Learn how to separate remote, sensor, operator, balance, and door hardware problems before replacing anything.",
    dek: "The opener gets blamed for nearly every failure. Sometimes it is the problem. Other times it is the only part telling you the door has become too hard—or unsafe—to move.",
    readTime: "6 min read",
    sections: [
      {
        heading: "Start with the simplest possibilities",
        paragraphs: [
          "Check whether the opener has power, whether a wall control lock mode is active, and whether the remote battery is fresh. Look for indicator lights or a diagnostic code in the operator manual. Confirm that nothing blocks the photo-eye path.",
          "If the motor runs but the door does not move, or the opener lifts only a few inches and stops, do not keep cycling it. A disconnected drive component, broken spring, jammed door, or balance problem may be present.",
        ],
      },
      {
        heading: "The opener should not compensate for a bad door",
        paragraphs: [
          "A correctly operating garage door is counterbalanced so the opener guides movement rather than dead-lifting the full door weight. Worn rollers, track binding, broken springs, loose cables, or damaged sections can overload the operator.",
          "Replacing the opener without correcting the door problem can damage the new equipment and leave the safety issue unresolved. A complete diagnosis separates the operator, controls, safety devices, and mechanical door system.",
        ],
        bullets: ["Remote works only at close range", "Door reverses before reaching the floor", "Motor hums but door does not travel", "Chain, belt, or rail makes a new noise", "Wall control works but remotes do not", "Door is heavy or uneven when disconnected by a professional"],
      },
      {
        heading: "Repair or replace?",
        paragraphs: [
          "Repair may make sense for a serviceable operator with a focused control, sensor, wiring, gear, or adjustment issue. Replacement may be more practical when the operator is obsolete, lacks modern safety features, has repeated failures, or is not suited to the door.",
          "Homeowners also choose replacement for quieter operation, battery backup, better lighting, or connected access. Those benefits matter only after the door itself is confirmed safe and compatible.",
        ],
      },
      {
        heading: "Get one diagnosis for the whole system",
        paragraphs: [
          "Morgan Door repairs all major brands and installs door and operator systems across Twin Falls, Burley, Rupert, Kimberly, and the Magic Valley. When requesting service, note the opener brand if visible, which controls work, what the lights do, and how far the door moves.",
          "That information helps, but you do not need to diagnose the system yourself. The technician's job is to find whether the failure belongs to the controls, operator, door hardware, balance, or more than one of them.",
        ],
      },
    ],
    related: [
      { label: "Garage door repair for all brands", href: "/mdc/garage-door-repair" },
      { label: "Garage door maintenance and testing", href: "/mdc/maintenance-safety-checks" },
      { label: "Request opener service", href: "/mdc/free-quote" },
    ],
  },
  {
    slug: "morgan-door-50-years-burley",
    keyword: "family owned garage door company Burley Idaho",
    title: "50 Years in Burley: Why Morgan Door Company Is Still Family-Owned",
    description: "From Lynn Morgan in 1975 to Roger Morgan, Braxton Greener, and today's team: the story of a family-owned garage door company serving the Magic Valley.",
    dek: "A half-century in business is not just a date on the logo. It is evidence of thousands of local moments when the work—and the name behind it—had to hold up.",
    readTime: "5 min read",
    sections: [
      {
        heading: "Lynn Morgan started with local accountability",
        paragraphs: [
          "Morgan Door Company began in Burley in 1975. Lynn Morgan built the business around garage door installation and service at a time when every recommendation traveled quickly through the community.",
          "The basic expectation was practical: understand the problem, recommend what fits, do the work correctly, and be available when the customer needs help again.",
        ],
      },
      {
        heading: "Roger carried the company forward in 1998",
        paragraphs: [
          "When Roger Morgan took the business forward, the company grew with new door systems, operators, equipment, commercial applications, and customer expectations. The name on the truck still connected the work directly to the family and the community.",
          "That continuity matters because garage doors are long-lived systems. The installer you choose today may be the company you call years later for service, replacement parts, maintenance, or another building.",
        ],
      },
      {
        heading: "What family-owned should mean now",
        paragraphs: [
          "Family-owned is not an excuse to rely on handshakes instead of professional standards. In 2026, it should mean combining local accountability with trained installers, proper safety equipment, useful communication, clear quotes, and dependable follow-up.",
          "Morgan Door sells both Raynor and Hörmann, which supports residential and commercial product options, while the Burley team provides the local measurement, installation, service, and judgment that turn a product into a reliable door system.",
        ],
        bullets: ["Decisions made by people who live and work here", "A reputation built across decades, not ad campaigns", "Residential and commercial service from one team", "Long-term support after installation"],
      },
      {
        heading: "Serving the whole Magic Valley from Burley",
        paragraphs: [
          "Today, Roger, Braxton Greener, and the current team support homes, shops, farms, builders, and businesses across Burley, Twin Falls, Rupert, Heyburn, Kimberly, Jerome, Buhl, Filer, and nearby Southern Idaho communities.",
          "The goal for the next 50 years is the same as the first: make it easy to get a straight answer, safe work, and a door that does its job every day.",
        ],
      },
    ],
    related: [
      { label: "Read the Morgan Door story", href: "/mdc/about" },
      { label: "Explore residential installation", href: "/mdc/garage-door-installation" },
      { label: "Talk with the local team", href: "/mdc/free-quote" },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
