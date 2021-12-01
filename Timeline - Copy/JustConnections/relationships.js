// we decided to store this data as a js object instead of converting it from JSON
let relationshipData = 

[{name: "aaron", relations: [{name: "alma2", connection: "Friend", type: "Associate"}, {name: "ammon2", connection: "Brother", type: "Family"}, {name: "amalekite", connection: "Challenged Him", type: "Enemy"}, {name: "Anti-Nephi_lehi", connection: "Associate", type: "Associate"}, {name: "benjamin", connection: "Grandfather", type: "Family"}, {name: "godhead", connection: "Spoke to Him", type: "Divine"}, {name: "lamoni-father", connection: "Convert", type: "Associate"}, {name: "mosiah", connection: "Father", type: "Family"}, {name: "zoramite-prayer", connection: "Rehearsed Before Him", type: "Other"}]},
{name: "abinadi", relations: [{name: "alma", connection: "Convert", type: "Associate"}, {name: "godhead", connection: "Quoted by Him", type: "Quote"}, {name: "isaiah", connection: "Quoted by Him", type: "Quote"}, {name: "moses", connection: "Quoted by Him", type: "Quote"}, {name: "noah", connection: "King Who Killed Him", type: "Enemy"}]},
{name: "abinadom", relations: [{name: "amaleki", connection: "Son", type: "Family"}, {name: "chemish", connection: "Father", type: "Family"}]},
{name: "akish", relations: [{name: "jared-daughter", connection: "Wife", type: "Family"}, {name: "jared2", connection: "Fellow Conspirator", type: "Associate"}]},
{name: "alma", relations: [{name: "abinadi", connection: "Prophet Who Converted Him", type: "Associate"}, {name: "alma2", connection: "Son", type: "Family"}, {name: "gideon", connection: "Baptized by Him", type: "Associate"}, {name: "godhead", connection: "Spoke to Him", type: "Divine"}, {name: "helaman1", connection: "Grandson", type: "Family"}, {name: "limhi", connection: "Baptized by Him", type: "Associate"}, {name: "mosiah", connection: "Ruler and Prophet He Worked Under", type: "Associate"}, {name: "nephi1", connection: "His Direct Ancestor", type: "Family"}, {name: "noah", connection: "His King", type: "Associate"}]},
{name: "alma2", relations: [{name: "alma", connection: "Father", type: "Family"}, {name: "amulek", connection: "Friend", type: "Associate"}, {name: "angels", connection: "Visited Him", type: "Divine"}, {name: "antionah", connection: "Asked Him a Question", type: "Associate"}, {name: "judge", connection: "Persecuted Him", type: "Enemy"}, {name: "godhead", connection: "Quoted by Him", type: "Quote"}, {name: "helaman1", connection: "Son", type: "Family"}, {name: "helaman2", connection: "Grandson", type: "Family"}, {name: "korihor", connection: "Anti-Christ Who Was Questioned by Him", type: "Enemy"}, {name: "nephihah", connection: "Successor as Chief Judge", type: "Associate"}, {name: "poor-zoramite", connection: "Taught by Him", type: "Associate"}, {name: "zeezrom", connection: "Healed and Converted by Him", type: "Associate"}, {name: "zenock", connection: "Quoted by Him", type: "Quote"}, {name: "zenos", connection: "Quoted by Him", type: "Quote"}, {name: "zoramite-prayer", connection: "Rehearsed Before Him", type: "Other"}]},
{name: "amaleki", relations: [{name: "abinadom", connection: "Father", type: "Father"}, {name: "benjamin", connection: "His King to Whom He Conferred the Small Plates of Nephi", type: "Associate"}, {name: "chemish", connection: "Grandfather", type: "Family"}]},
{name: "amalickiah", relations: [{name: "ammoron", connection: "Brother", type: "Family"}, {name: "moroni1", connection: "Enemy", type: "Enemy"}, {name: "gid", connection: "Enemy", type: "Enemy"}, {name: "helaman1", connection: "Enemy", type: "Enemy"}]},
{name: "amaron", relations: [{name: "chemish", connection: "Son", type: "Family"}, {name: "godhead", connection: "Quoted by Him", type: "Quote"}, {name: "omni", connection: "Father", type: "Family"}]},
{name: "aminadab", relations: [{name: "godhead", connection: "Spoke to Him", type: "Divine"}, {name: "nephi2", connection: "Prophet Who Converted Him", type: "Associate"}]},
{name: "ammaron", relations: [{name: "Amos", connection: "Brother", type: "Family"}, {name: "mormon", connection: "Conferred the Plates by Him", type: "Associate"}]},
{name: "ammon1", relations: [{name: "limhi", connection: "Found by Him", type: "Associate"}, {name: "mosiah", connection: "His King Who Sent Him to Find limhi", type: "Associate"}]},
{name: "ammon2", relations: [{name: "aaron", connection: "Brother", type: "Family"}, {name: "alma2", connection: "Friend", type: "Associate"}, {name: "anti-nephi-lehi", connection: "Associate", type: "Associate"}, {name: "benjamin", connection: "Grandfather", type: "Family"}, {name: "godhead", connection: "Quoted by Him", type: "Quote"}, {name: "lamoni", connection: "Convert", type: "Associate"}, {name: "lamoni-wife", connection: "Convert", type: "Associate"}, {name: "mosiah", connection: "Father", type: "Family"}, {name: "lamoni-servant", connection: "Fellow Servant", type: "Associate"}, {name: "zoramite-prayer", connection: "Rehearsed Before Him", type: "Other"}]},
{name: "ammoron", relations: [{name: "amalickiah", connection: "Brother", type: "Family"}, {name: "moroni1", connection: "Enemy", type: "Enemy"}, {name: "gid", connection: "Enemy", type: "Enemy"}, {name: "helaman1", connection: "Enemy", type: "Enemy"}]},
{name: "amulek", relations: [{name: "alma2", connection: "Friend", type: "Associate"}, {name: "angels", connection: "Visited Him", type: "Divine"}, {name: "judge", connection: "Persecuted Him", type: "Enemy"}, {name: "godhead", connection: "Quoted by Him", type: "Quote"}, {name: "poor-zoramite", connection: "Taught by Him", type: "Associate"}, {name: "zeezrom", connection: "Challenged Him and Was Converted by Him", type: "Associate"}, {name: "zoramite-prayer", connection: "Rehearsed Before Him", type: "Other"}]},
{name: "amalekite", relations: [{name: "aaron", connection: "Challenged by Him", type: "Enemy"}]},
{name: "angels", relations: [{name: "alma2", connection: "Visited by Them", type: "Divine"}, {name: "amulek", connection: "Visited by Them", type: "Divine"}, {name: "benjamin", connection: "Visited by Them", type: "Divine"}, {name: "godhead", connection: "Quoted by Him", type: "Quote"}, {name: "nephi", connection: "Visited by Them", type: "Divine"}, {name: "nephi-brethren", connection: "Visited by Them", type: "Divine"}, {name: "samuel-lamanite", connection: "Visited by Them", type: "Divine"}]},
{name: "anti-nephi-lehi", relations: [{name: "aaron", connection: "Associate", type: "Associate"}, {name: "ammon2", connection: "Associate", type: "Associate"}, {name: "lamoni", connection: "Brother", type: "Family"}, {name: "lamoni-father", connection: "Father", type: "Family"}, {name: "lamoni-wife", connection: "Sister in Law", type: "Family"}]},
{name: "antionah", relations: [{name: "alma2", connection: "Asked a Question by Him", type: "Associate"}]},
{name: "benjamin", relations: [{name: "aaron", connection: "Grandson", type: "Family"}, {name: "ammon2", connection: "Grandson", type: "Family"}, {name: "amaleki", connection: "Conferred the Small Plates of Nephi to Him", type: "Associate"}, {name: "angels", connection: "Visited Him", type: "Divine"}, {name: "mosiah", connection: "Son", type: "Family"}]},
{name: "jared-brother", relations: [{name: "godhead", connection: "Spoke to Him", type: "Divine"}, {name: "jared", connection: "Brother", type: "Family"}]},
{name: "moroni1", relations: [{name: "alma2", connection: "Prophet Who Directed Him Where to Fight", type: "Associate"}, {name: "amalickiah", connection: "Enemy", type: "Enemy"}, {name: "ammoron", connection: "Enemy", type: "Enemy"}, {name: "gid", connection: "Brother in Arms", type: "Associate"}, {name: "godhead", connection: "Quoted by Him", type: "Quote"}, {name: "helaman1", connection: "Prophet and Brother in Arms", type: "Associate"}, {name: "jacob-israel", connection: "Quoted by Him", type: "Quote"}, {name: "laman-spy", connection: "One of His Soldiers", type: "Associate"}, {name: "nephite-soldier", connection: "One of His Soldiers", type: "Associate"}, {name: "pahoran", connection: "His Chief Judge and Brother in Arms", type: "Associate"}, {name: "zerahemnah", connection: "Enemy", type: "Enemy"}]},
{name: "chemish", relations: [{name: "abinadom", connection: "Son", type: "Family"}, {name: "amaleki", connection: "Grandson", type: "Family"}, {name: "amaron", connection: "Father", type: "Family"}]},
{name: "judge", relations: [{name: "alma2", connection: "Persecuted by Him", type: "Enemy"}, {name: "amulek", connection: "Persecuted by Him", type: "Enemy"}, {name: "zeezrom", connection: "Defended Alma and amulek Before Him", type: "Enemy"}]},
{name: "christ", relations: [{name: "godhead", connection: "Quoted by Him", type: "Quote"}, {name: "isaiah", connection: "Quoted by Him", type: "Quote"}, {name: "malachi", connection: "Quoted by Him", type: "Quote"}, {name: "micah", connection: "Quoted by Him", type: "Quote"}, {name: "moses", connection: "Quoted by Him", type: "Quote"}]},
{name: "jared-daughter", relations: [{name: "akish", connection: "Husband", type: "Family"}, {name: "jared2", connection: "Father", type: "Family"}]},
{name: "ishmael-daughter", relations: [{name: "lehi", connection: "Father in Law", type: "Family"}, {name: "nephi-brethren", connection: "Husbands and Brothers in Law", type: "Family"}, {name: "nephi1", connection: "Husband and Brother in Law", type: "Family"}, {name: "sariah", connection: "Mother in Law", type: "Family"}]},
{name: "enos", relations: [{name: "godhead", connection: "Spoke to Him", type: "Divine"}, {name: "jacob", connection: "Father", type: "Family"}, {name: "jarom", connection: "Son", type: "Family"}, {name: "lehi", connection: "Grandfather", type: "Family"}, {name: "omni", connection: "Grandson", type: "Family"}]},
{name: "ether", relations: [{name: "godhead", connection: "Spoke to Him", type: "Divine"}, {name: "jared", connection: "His Direct Ancestor", type: "Family"}]},
{name: "gid", relations: [{name: "amalickiah", connection: "Enemy", type: "Enemy"}, {name: "ammoron", connection: "Enemy", type: "Enemy"}, {name: "moroni1", connection: "Brother in Arms", type: "Associate"}, {name: "helaman1", connection: "Brother in Arms", type: "Associate"}]},
{name: "giddianhi", relations: [{name: "gidgiddoni", connection: "Enemy", type: "Enemy"}, {name: "lachoneus", connection: "Enemy", type: "Enemy"}]},
{name: "giddonah", relations: [{name: "korihor", connection: "Judged by Him", type: "Enemy"}]},
{name: "gideon", relations: [{name: "alma", connection: "Baptized Him", type: "Associate"}, {name: "limhi", connection: "His King Whome He Served", type: "Associate"}, {name: "noah", connection: "His King Whom He Almost Killed", type: "Enemy"}]},
{name: "gidgiddoni", relations: [{name: "giddianhi", connection: "Enemy", type: "Enemy"}, {name: "lachoneus", connection: "His King Whom Served as Chief Captain", type: "Associate"}]},
{name: "godhead", relations: [{name: "aaron", connection: "Heard Their Voice", type: "Divine"}, {name: "abinadi", connection: "Quoted Them", type: "Quote"}, {name: "alma", connection: "Heard Their Voice", type: "Divine"}, {name: "alma2", connection: "Quoted Them", type: "Quote"}, {name: "amaron", connection: "Quoted Them", type: "Quote"}, {name: "aminadab", connection: "Heard Their Voice", type: "Divine"}, {name: "ammon2", connection: "Quoted Them", type: "Quote"}, {name: "amulek", connection: "Quoted Them", type: "Quote"}, {name: "angels", connection: "Quoted Them", type: "Quote"}, {name: "jared-brother", connection: "Heard Their Voice", type: "Divine"}, {name: "moroni1", connection: "Quoted Them", type: "Quote"}, {name: "christ", connection: "Quoted Them", type: "Quote"}, {name: "enos", connection: "Heard Their Voice", type: "Divine"}, {name: "ether", connection: "Heard Their Voice", type: "Divine"}, {name: "jacob", connection: "Quoted Them", type: "Quote"}, {name: "jarom", connection: "Quoted Them", type: "Quote"}, {name: "lehi", connection: "Quoted Them", type: "Quote"}, {name: "limhi", connection: "Quoted Them", type: "Quote"}, {name: "mormon", connection: "Quoted Them", type: "Quote"}, {name: "moroni2", connection: "Quoted Them", type: "Quote"}, {name: "mosiah", connection: "Heard Their Voice", type: "Divine"}, {name: "nephi2", connection: "Heard Their Voice", type: "Divine"}, {name: "nephi1", connection: "Quoted Them", type: "Quote"}, {name: "samuel-lamanite", connection: "Quoted Them", type: "Quote"}]},
{name: "helaman1", relations: [{name: "alma", connection: "Grandfather", type: "Family"}, {name: "alma2", connection: "Father", type: "Family"}, {name: "amalickiah", connection: "Enemy", type: "Enemy"}, {name: "ammoron_Son_of_amalickiah", connection: "Enemy", type: "Enemy"}, {name: "moroni1", connection: "Brother in Arms", type: "Associate"}, {name: "gid", connection: "Brother in Arms", type: "Associate"}, {name: "helaman2", connection: "Son", type: "Family"}, {name: "nephi2", connection: "Grandson", type: "Family"}]},
{name: "helaman2", relations: [{name: "alma2", connection: "Grandfather", type: "Family"}, {name: "helaman1", connection: "Father", type: "Family"}, {name: "nephi2", connection: "Son", type: "Family"}, {name: "helaman-servant", connection: "Servant", type: "Associate"}]},
{name: "isaiah", relations: [{name: "abinadi", connection: "Quoted Him", type: "Quote"}, {name: "christ", connection: "Quoted Him", type: "Quote"}, {name: "jacob", connection: "Quoted Him", type: "Quote"}, {name: "nephi1", connection: "Quoted Him", type: "Quote"}]},
{name: "jacob-israel", relations: [{name: "moroni1", connection: "Quoted Him", type: "Quote"}, {name: "joseph", connection: "Son", type: "Family"}]},
{name: "jacob", relations: [{name: "ishmael-daughter", connection: "Sisters in Law", type: "Family"}, {name: "enos", connection: "Son", type: "Family"}, {name: "godhead", connection: "Quoted by Him", type: "Quote"}, {name: "isaiah", connection: "Quoted by Him", type: "Quote"}, {name: "jarom", connection: "Grandson", type: "Family"}, {name: "lehi", connection: "Father", type: "Family"}, {name: "nephi-brethren", connection: "Brothers", type: "Family"}, {name: "nephi1", connection: "Brother", type: "Family"}, {name: "sariah", connection: "Mother", type: "Family"}, {name: "sherem", connection: "Challenged Him", type: "Enemy"}, {name: "zenos", connection: "Quoted by Him", type: "Quote"}]},
{name: "jared", relations: [{name: "jared-brother", connection: "Brother", type: "Family"}, {name: "ether", connection: "His Direct Descendant", type: "Family"}]},
{name: "jared2", relations: [{name: "akish", connection: "Fellow Conspirator", type: "Associate"}, {name: "jared-daughter", connection: "Daughter", type: "Family"}]},
{name: "jarom", relations: [{name: "amaron", connection: "Grandson", type: "Family"}, {name: "enos", connection: "Father", type: "Family"}, {name: "godhead", connection: "Quoted by Him", type: "Quote"}, {name: "jacob", connection: "Grandfather", type: "Family"}, {name: "omni", connection: "Son", type: "Family"}]},
{name: "john", relations: [{name: "lehi", connection: "Quoted Him", type: "Quote"}]},
{name: "joseph", relations: [{name: "jacob-israel", connection: "Father", type: "Family"}, {name: "lehi", connection: "Quoted Him", type: "Quote"}]},
{name: "joshua", relations: [{name: "mormon", connection: "Quoted Him", type: "Quote"}, {name: "moses", connection: "Friend", type: "Associate"}]},
{name: "korihor", relations: [{name: "alma2", connection: "Questioned Him", type: "Enemy"}, {name: "giddonah", connection: "Judged Him", type: "Enemy"}, {name: "satan", connection: "Appeared to Him and Taught Him What to Say", type: "Other"}]},
{name: "laban", relations: [{name: "nephi", connection: "Asked Him for the Plates of Brass and Slew Him", type: "Enemy"}, {name: "nephi-brethren", connection: "Asked Him for the Plates of Brass", type: "Enemy"}]},
{name: "lachoneus", relations: [{name: "giddianhi", connection: "Enemy", type: "Enemy"}, {name: "gidgiddoni", connection: "His Chief Captain", type: "Associate"}]},
{name: "laman-spy", relations: [{name: "amalickiah", connection: "Enemy", type: "Enemy"}, {name: "ammoron", connection: "Enemy", type: "Enemy"}, {name: "moroni1", connection: "His Commanding Officer", type: "Associate"}]},
{name: "lamanite-king", relations: [{name: "limhi", connection: "His Tributary Subject", type: "Enemy"}]},
{name: "lamoni-wife", relations: [{name: "ammon2", connection: "Converted Her", type: "Associate"}, {name: "anti-nephi-lehi", connection: "Brother in Law", type: "Family"}, {name: "lamoni", connection: "Husband", type: "Family"}, {name: "lamoni-father", connection: "Father in Law", type: "Family"}, {name: "lamoni-servant", connection: "Servant", type: "Associate"}]},
{name: "lamoni", relations: [{name: "ammon2", connection: "Converted Him", type: "Associate"}, {name: "anti-nephi-lehi", connection: "Brother", type: "Family"}, {name: "lamoni-father", connection: "Father", type: "Family"}, {name: "lamoni-wife", connection: "Wife", type: "Family"}, {name: "lamoni-servant", connection: "Servant", type: "Associate"}]},
{name: "lamoni-father", relations: [{name: "aaron", connection: "Converted Him", type: "Associate"}, {name: "anti-nephi-lehi", connection: "Son", type: "Family"}, {name: "ammon2", connection: "Contended with Him", type: "Associate"}, {name: "lamoni", connection: "Son", type: "Family"}, {name: "lamoni-wife", connection: "Daughter in Law", type: "Family"}]},
{name: "lehi", relations: [{name: "enos", connection: "Grandson", type: "Family"}, {name: "godhead", connection: "Quoted by Him", type: "Quote"}, {name: "jacob", connection: "Son", type: "Family"}, {name: "john", connection: "Quoted by Him", type: "Quote"}, {name: "joseph", connection: "Quoted by Him", type: "Quote"}, {name: "nephi-brethren", connection: "Sons", type: "Family"}, {name: "nephi1", connection: "Son", type: "Family"}, {name: "sariah", connection: "Wife", type: "Family"}]},
{name: "limhi", relations: [{name: "alma", connection: "Baptized Him", type: "Associate"}, {name: "ammon1", connection: "Found Him", type: "Associate"}, {name: "gideon", connection: "Served Him", type: "Associate"}, {name: "godhead", connection: "Quoted by Him", type: "Quote"}, {name: "lamonite_King_who_Fought_against_limhi", connection: "His Tributary Subjector", type: "Enemy"}, {name: "mosiah", connection: "King Whom He Became Subject to", type: "Associate"}, {name: "noah", connection: "Father", type: "Family"}, {name: "zeniff", connection: "Grandfather", type: "Family"}]},
{name: "malachi", relations: [{name: "christ", connection: "Quoted Him", type: "Quote"}]},
{name: "micah", relations: [{name: "christ", connection: "Quoted Him", type: "Quote"}]},
{name: "mormon", relations: [{name: "godhead", connection: "Quoted by Him", type: "Quote"}, {name: "joshua", connection: "Quoted by Him", type: "Quote"}, {name: "moroni2", connection: "Son", type: "Family"}, {name: "nephi1", connection: "His Direct Ancestor", type: "Family"}]},
{name: "moroni2", relations: [{name: "godhead", connection: "Quoted by Him", type: "Quote"}, {name: "mormon", connection: "Father", type: "Family"}]},
{name: "moses", relations: [{name: "abinadi", connection: "Quoted Him", type: "Quote"}, {name: "christ", connection: "Quoted Him", type: "Quote"}, {name: "joshua", connection: "Friend", type: "Associate"}, {name: "nephi1", connection: "Quoted Him", type: "Quote"}]},
{name: "mosiah", relations: [{name: "alma", connection: "Associate", type: "Associate"}, {name: "ammon2", connection: "Son", type: "Family"}, {name: "ammon1", connection: "Sent by Him to Find limhi", type: "Associate"}, {name: "aaron", connection: "Son", type: "Family"}, {name: "benjamin", connection: "Father", type: "Family"}, {name: "godhead", connection: "Quoted by Him", type: "Quote"}, {name: "limhi", connection: "Became Subject to Him", type: "Associate"}]},
{name: "nephi1", relations: [{name: "alma", connection: "His Direct Descendant", type: "Family"}, {name: "angels", connection: "Visited Him", type: "Divine"}, {name: "ishmael-daughter", connection: "Wife and Sisters in Law", type: "Family"}, {name: "godhead", connection: "Quoted by Him", type: "Quote"}, {name: "isaiah", connection: "Quoted by Him", type: "Quote"}, {name: "jacob", connection: "Brother", type: "Family"}, {name: "lehi", connection: "Father", type: "Family"}, {name: "mormon", connection: "His Direct Descendant", type: "Family"}, {name: "moses", connection: "Quoted by Him", type: "Quote"}, {name: "nephi-brethren", connection: "Brothers", type: "Family"}, {name: "sariah", connection: "Mother", type: "Family"}, {name: "zenos", connection: "Quoted by Him", type: "Quote"}]},
{name: "nephi2", relations: [{name: "aminadab", connection: "Convert", type: "Associate"}, {name: "godhead", connection: "Spoke to Him", type: "Divine"}, {name: "helaman1", connection: "Grandfather", type: "Family"}, {name: "helaman2", connection: "Father", type: "Family"}]},
{name: "nephihah", relations: [{name: "alma2", connection: "Yielded Judgement Seat to Him", type: "Associate"}, {name: "pahoran", connection: "Son", type: "Family"}]},
{name: "nephi-brethren", relations: [{name: "angels", connection: "Visited Them", type: "Divine"}, {name: "ishmael-daughter", connection: "Wives and Sisters in Law", type: "Family"}, {name: "jacob", connection: "Brother", type: "Family"}, {name: "lehi", connection: "Father", type: "Family"}, {name: "nephi", connection: "Brother", type: "Family"}, {name: "sariah", connection: "Mother", type: "Family"}]},
{name: "nephite-soldier", relations: [{name: "moroni1", connection: "His Commanding Officer", type: "Associate"}, {name: "zerahemnah", connection: "Scalped by Him", type: "Enemy"}]},
{name: "noah", relations: [{name: "abinadi", connection: "Prophet Whom He Killed", type: "Enemy"}, {name: "Alma", connection: "His Priest", type: "Associate"}, {name: "gideon", connection: "Almost Killed Him", type: "Enemy"}, {name: "limhi", connection: "Son", type: "Family"}, {name: "zeniff", connection: "Father", type: "Family"}]},
{name: "omni", relations: [{name: "amaron", connection: "Son", type: "Family"}, {name: "jarom", connection: "Father", type: "Family"}]},
{name: "pahoran", relations: [{name: "amalickiah", connection: "Enemy", type: "Enemy"}, {name: "ammoron", connection: "Enemy", type: "Enemy"}, {name: "moroni1", connection: "His Chief Captain and Brother in Arms", type: "Associate"}, {name: "gid", connection: "One of His Captains and Brother in Arms", type: "Associate"}, {name: "helaman1", connection: "The Prophet, One of His Captains, and His Brother in Arms", type: "Associate"}, {name: "nephihah", connection: "Father", type: "Family"}]},
{name: "poor-zoramite", relations: [{name: "alma2", connection: "Preached to Him", type: "Associate"}, {name: "amulek", connection: "Preached to Him", type: "Associate"}]},
{name: "samuel-lamanite", relations: [{name: "angels", connection: "Visited Him", type: "Divine"}, {name: "godhead", connection: "Quoted by Him", type: "Quote"}]},
{name: "sariah", relations: [{name: "ishmael-daughter", connection: "Daughters in Law", type: "Family"}, {name: "jacob", connection: "Son", type: "Family"}, {name: "lehi", connection: "Husband", type: "Family"}, {name: "nephi", connection: "Son", type: "Family"}, {name: "nephi-brethren", connection: "Sons", type: "Family"}]},
{name: "satan", relations: [{name: "korihor", connection: "Followed Him", type: "Other"}]},
{name: "helaman-servant", relations: [{name: "helaman2", connection: "The Chief Judge Whom He Served", type: "Associate"}]},
{name: "lamoni-servant", relations: [{name: "ammon2", connection: "Fellow Servant", type: "Associate"}, {name: "lamoni", connection: "Served by Him", type: "Associate"}, {name: "lamoni-wife", connection: "Served by Him", type: "Associate"}]},
{name: "sherem", relations: [{name: "jacob", connection: "Challenged by Him", type: "Enemy"}]},
{name: "zeezrom", relations: [{name: "alma2", connection: "Healed Him and Converted Him", type: "Associate"}, {name: "amulek", connection: "Challenged by Him and Converted Him", type: "Associate"}, {name: "judge", connection: "Heard His Defense of Alma and amulek", type: "Enemy"}, {name: "zoramite-prayer", connection: "Rehearsed Before Him", type: "Other"}]},
{name: "zeniff", relations: [{name: "limhi", connection: "Grandson", type: "Family"}, {name: "noah", connection: "Son", type: "Family"}]},
{name: "zenock", relations: [{name: "alma2", connection: "Quoted Him", type: "Quote"}]},
{name: "zenos", relations: [{name: "alma2", connection: "Quoted Him", type: "Quote"}, {name: "jacob", connection: "Quoted Him", type: "Quote"}, {name: "nephi1", connection: "Quoted Him", type: "Quote"}]},
{name: "zerahemnah", relations: [{name: "moroni1", connection: "Enemy", type: "Enemy"}, {name: "nephite-soldier", connection: "Scalped Him", type: "Enemy"}]},
{name: "zoramite-prayer", relations: [{name: "aaron", connection: "Heard it", type: "Other"}, {name: "Alma", connection: "Heard it", type: "Other"}, {name: "ammon2", connection: "Heard it", type: "Other"}, {name: "amulek", connection: "Heard it", type: "Other"}, {name: "poor-zoramite", connection: "Prohibited from Saying it in the Synagogues", type: "Other"}, {name: "zeezrom", connection: "Heard it", type: "Other"}]}]


    
   