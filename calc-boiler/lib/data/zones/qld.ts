// Queensland — ATO Australian zone list, last updated 1 July 2026.
// https://www.ato.gov.au/calculators-and-tools/tax-offsets-australian-zones/queensland
// Transcribed 28 July 2026.
//
// Notes:
// - Longreach and Winton are Zone B, and Birdsville is a Zone A special area.
//   The site previously published all three as plain Zone A.
// - Rockhampton and Gladstone do not appear on the ATO list at all. The site
//   listed both as Zone B.
// - Mount Isa, Cloncurry and Cooktown are Zone A; Cairns, Townsville, Mackay,
//   Atherton and Charters Towers are Zone B.
// - "One Tree Island" is published by the ATO as not in a zone.
// - The ATO's page repeats Mowbray, Mowbray River and Mowo in its M section;
//   they are transcribed once and the aggregator dedupes defensively.

export const QLD_RAW = `
Abbotsville|B
Aberfoyle|B
Abergowrie|B
Abingden Downs|AS
Abswold|B
Acacia Downs|B
Adavale|B
Adelong|B
Adels Grove (Mt Isa)|AS
Advance|BS
Aeroglen|B
Agnew|AS
Airdale|B
Airdmillan|B
Airlie Beach|B
Airville|B
Aitkenvale|B
Alba Siding|BS
Albilah|B
Alcala|AS
Alderbury|A
Alexandra|B
Algoma|B
Alice|B
Alice River|B
Alice Downs|B
Allen Island|AS
Alligator Creek|B
Allingham|B
Almaden|A
Almora|AS
Aloomba|B
Alroy|B
Ambathala|B
Amhurst|B
Anavale|B
Andergrove|B
Andersonville|B
Andoom|AS
Angellala|B
Anna Dale|B
Annandale (Diamantina)|AS
Annandale (near Nebo)|B
Answer Downs|AS
Antil Plains|B
Aqua Downs|B
Arabella|B
Aragon|A
Aramac|B
Arcadia|B
Ardglen|B
Ardmore|A
Ardoch|B
Argea|B
Arizona|AS
Arjuna|BS
Armadilla|B
Armraynald|AS
Armstrong Beach|B
Armuna|B
Army Downs|A
Arno|B
Arrabury|BS
Arriga|B
Arrilalah|B
Ascot (Winton)|B
Asmus|A
Atherton|B
Atinla|B
Augathella|B
Augustus Downs|AS
Aurukun|AS
Authoringa|B
Autumn Vale|BS
Avington|B
Ayr|B
Ayton|AS
Babbiloora|B
Babinda|B
Baddila|B
Badu Island|AS
Bakers Creek|B
Balberra|B
Balbuna|B
Balfe's Creek|B
Balgal Beach|B
Ballal|B
Ball Bay|B
Ballindalloch|BS
Ballygar|B
Balnagowan|B
Balootha|AS
Bamaga|AS
Bambaroo|B
Bamboo|B
Ban Ban|B
Banna|B
Barabon|BS
Barboorah|B
Barcaldine|B
Barclay Downs|A
Barcoorah|B
Barduthulla|B
Barenya|B
Barkly Downs|A
Barngo|B
Baronta|B
Barratta|B
Barrilgie|B
Barrine|B
Barringha|B
Barrington|B
Barron Falls|B
Bartle Frere|B
Barwidgi|A
Batavia Downs|AS
Batcha|A
Battle Camp|AS
Bawooing|AS
Bayview Heights|B
Beachview Atherton|B
Beaconsfield|B
Beal|B
Beallah|B
Beatrice River|B
Bedourie|AS
Beechal|B
Belfast|BS
Belgian Gardens|B
Bellalie|BS
Bellenden Ker|B
Bellevue|AS
Bellevue (Flinders)|B
Bellfield (Croydon)|AS
Belmont Station (near Winton)|B
Belvedere|B
Bemerside|B
Bendemeer|BS
Bendie Downs|BS
Benholme|B
Benlidi|B
Bentinck Island|AS
Bentley Park|B
Bergaje|B
Berriwerri|B
Bertiehaugh|AS
Beryl|B
Betoota|AS
Bexley|B
Bibil|B
Biboohra|B
Bierbank Siding|B
Big Rush Mine|BS
Bilwon|B
Bilyana|B
Bimerah|B
Binbee|B
Bingil Bay|B
Birdsville|AS
Birkalla|B
Black Braes|BS
Black River|B
Blacks Beach|B
Blackall|B
Blackbank|B
Blackbull|AS
Blackgate|B
Blairmoor|B
Blantyre|B
Bloomfield (Blackall)|BS
Bloomfield River|AS
Bloomsbury|B
Blue Mountain (near Nebo)|B
Bluewater|B
Bluewater Park|B
Bluff Downs|B
Boatman|B
Bobawaba|B
Bogarilla|B
Bogewong|B
Bogunda|B
Bohle|B
Bohle Plains|B
Bohle Vale|B
Boigu Island|AS
Bombeeta|B
Bonna Vonna|B
Bonnie Doon|B
Bontabo|B
Boobara|B
Boogan|B
Bookin|A
Boolbanna|B
Boomara|A
Boongana|B
Boonmoo|B
Boorara|B
Bootooloo|B
Boree|BS
Boulia|AS
Bountiful Island|AS
Bowen|B
Bowen Downs|B
Bowie|B
Bowthorn|AS
Bowyer|B
Braceborough|B
Brackenburgh|BS
Braemeadows|B
Braeside (Mckinlay)|AS
Bramwell|AS
Brandon|B
Breadalbane|AS
Breddan|B
Briaba|B
Brightlands|A
Brighton Downs (Winton)|BS
Brinawa|AS
Brinsmead|B
Brixton|B
Broadford|BS
Broadlands|B
Broadleigh Downs|B
Bronte|B
Brook Hill|B
Brooklyn (Mossman)|B
Brooklyn (Winton)|BS
Broughton|B
Brunel Downs|B
Bucasia|B
Buckingham Downs|A
Budgerygar|B
Bulgroo|BS
Bulgun|B
Bulimba (North Qld)|AS
Bulliwallah|B
Bullock Creek|A
Bulloo Downs|BS
Bunda Bunda|AS
Bundaleer|B
Bungalien|A
Bungalow|B
Burdekin Falls|B
Burdell|B
Burgah|B
Burgamoo|B
Burketown|AS
Burleigh|AS
Burnham|AS
Burra|B
Burrenbah|BS
Burrenbring|B
Bushland Beach|B
Busthinia|B
Butchers Creek|B
Buthurra|B
Butru|A
Buzzacot|B
Byerstown|B
Cairns|B
Cairns North|B
Cairo|B
Caiwarra|B
Calcifer|A
Calcium|B
Caldervale|B
Caledonia|B
Calen|B
Calton Hills (Mt Isa)|A
Cameron Downs|BS
Camoola|B
Camooweal|A
Campwin Beach|B
Canary|AS
Canaway Downs|B
Cannington|AS
Cannington Mine|AS
Cannon Valley|B
Cannonvale|B
Cannonvale Beach|B
Cannum Downs|BS
Canobie|AS
Canterbury|BS
Cape Bedford|AS
Cape Cleveland|B
Cape Flattery|AS
Cape River|B
Cape Tribulation|B
Caping|B
Carandotta|A
Caravonica|B
Carbeen|B
Carbonate Creek|B
Cardigan|B
Cardington|B
Cardross|A
Cardstone|B
Cardwell|B
Carella|B
Carlisle Island|B
Carmarthen Downs|AS
Carnavon|B
Carpentaria Downs|AS
Carranya|BS
Carrar|AS
Carrick|AS
Carrington|B
Carruchan|B
Carstairs|B
Carwell|B
Cassilis|AS
Cassowary|B
Castle Hill|B
Cathy|B
Catumnal|B
Chadshunt|AS
Charleville|B
Charlotte Plains (Flinder)|B
Charlotte Plains (Paroo)|B
Charringa|B
Charters Towers|B
Chatsworth Station (Mt Isa)|A
Cheepie|B
Chelona|B
Chesterton|B
Cheviot Hills|BS
Chewko|B
Chillagoe|A
Chiltern Hills|BS
Chilverton|B
Chinbi|BS
Chircan|B
Chorregon|B
Chudleigh Park|BS
Chumbrumba|B
Clanside|B
Claraville|AS
Clare|B
Claredale|B
Clarina|AS
Clarke Hills|B
Clarke River|B
Claverton|B
Cleeve|B
Clevedon|B
Clifton Beach|B
Clifton Ville|B
Clio (Richmond Shire)|AS
Clio (Winton Shire)|BS
Clonagh|A
Cloncurry|A
Cluden|B
Clunie Vale|B
Cluny|AS
Clutha|AS
Coalbrook|AS
Cockenzie|B
Coconuts|B
Coen|AS
Colabara|B
Collingvale|B
Collinsville|B
Comongin|B
Compton Downs|BS
Condon|B
Conegwoi|BS
Congie|BS
Coningsby|B
Coniston|BS
Conjuboy|B
Conn|B
Connemara|B
Connolly|B
Conway|B
Cooinda|B
Cooktown|A
Cooladdi|B
Coolamon (North)|B
Coolatai|BS
Coolbie|B
Cooleys Well|B
Coolgarra|B
Coolullah|A
Cooncan|BS
Coongoola|B
Coorabulka|AS
Cooya Beach|B
Cooyeana|AS
Coppabella|B
Cordelia|B
Corea Plains|B
Coreena|B
Corfield|BS
Corfu|B
Corinda Station|B
Corindi|B
Cork|BS
Corona|B
Cosgrove|B
Cow Bay|B
Cowan Downs|AS
Cowley|B
Craiglie|B
Cramsie|B
Cranbrook|B
Crediton|B
Creen Creek|A
Cremona|AS
Crendon (Richmond)|AS
Crendon (Winton)|B
Crescent Downs|B
Cromarty|B
Croydon|AS
Cu–Cania|B
Cuckadoo|AS
Cuddapan|BS
Cullinane|B
Cumberland|A
Cumberland Island|B
Cungulla|B
Cunnamulla|B
Curalle|BS
Currajah|B
Currajong|B
Currareva|BS
Currawilla|BS
Currawinya|B
Dagworth|AS
Daintree|B
Dajarra|A
Dalbeg|B
Dalgonally|AS
Dalkieth (Hughenden)|BS
Dalkieth (Julia Creek)|AS
Dalkieth (Longreach)|B
Dallachy|B
Dalmore|B
Dalrymple Heights|B
Danbulla|B
Daradgee|B
Darr|B
Dartmouth|B
Davenport Downs|BS
Dawlish|B
Daydream Island|B
Debella (Bowen)|B
Debella (Julia Creek)|AS
Deeragun|B
Deeral|B
Degarra|AS
Deighton|A
Delta|B
Delta Downs|AS
Denham Island|AS
Denleigh Downs|BS
Derbyshire Downs|B
Dessailery|B
Devereux Creek|B
Devlin|BS
Devon Court|A
Diamantina Lakes|BS
Diamond Plains Outstation|B
Dicks Creek|B
Dillalah|B
Dillcar|B
Dimbulah|B
Dimora|AS
Ding Wall|B
Dingo Beach|B
Dittmer|B
Dixie|AS
Djarawong|B
Dobbyn|A
Dolomite|A
Dolphin Heads|B
Don|B
Donald Downs|BS
Donor's Hill|AS
Doomadgee|AS
Doongmabulla Station|BS
Dotswood|B
Douglas (near Townsville)|B
Douglas Downs (Mt Isa)|A
Dow's Creek|B
Drapers|B
Dronfield|A
Drumduff|AS
Drummoyne|B
Duchess|A
Dumbleton|B
Dunbar|AS
Dundee (Murweh)|BS
Dundoo|B
Dundulo|B
Dungiven|B
Dunk Island|B
Dunwold|B
Durham Downs|BS
Durrie|AS
Dynevor Downs|B
Eaglefield|B
Earlstoun|B
Earlville|B
East Haydon|AS
East Lake (Paroo)|B
East Mackay|B
East Trinity|B
Eastmere|B
Ebagoola|AS
Eddington Siding|AS
Edge Hill|B
Edmonton|B
Edward River|AS
Eimeo|B
Einasleigh|AS
El Arish|B
Elaroo|B
Elderslie (near Cooktown)|A
Elderslie (Winton)|BS
Elinjaa|B
Ellerbeck|B
Elmina|B
Elsie Hills|BS
Elton|B
Elverston|B
Elvo|BS
Elwell|B
Emerald Creek (Mareeba)|B
Emmet|B
Emu Plains (Bowen)|B
Emudilla|B
Endeavour|AS
Epsilon|BS
Erakala|B
Erne|BS
Eromanga|BS
Escombe Downs|BS
Escott|AS
Esmerelda|AS
Eton|B
Etowri|B
Etty Bay|B
Eubenangee|B
Eulo|B
Eulolo|AS
Eungella|B
Euramo|B
Eureka (Nebo)|B
Euri|B
Euroka Springs|AS
Eurunga|B
Evelyn|B
Everton|B
Evora|B
Ewan|B
Ewan Plains|B
Exley|B
Exmoor|A
Fairlight|AS
Fairview (Richmond)|AS
Fairview (Winton)|B
Fairyland|B
Fanning|B
Fanning River|B
Farleigh|B
Feluga|B
Ferndale (Paroo)|B
Figtree Creek|B
Finch Hatton|B
Fishery Falls|B
Flaggy|A
Flaggy Creek|B
Fleetwood|BS
Flinders Group|AS
Flodden Hills|B
Floraville|AS
Floreat|B
Florence|A
Floriana|B
Flourspar|A
Flying Fish Point|B
Forest Home (Ethridge)|AS
Forrest Beach|B
Forsayth|AS
Forsyth Island|AS
Forsythe's Siding|AS
Fort Constantine|A
Fortuna|B
Fossilbrook|A
Foxdale|B
Fraser|B
Frenchman Creek|B
Frensham|BS
Freshwater|B
Freshwater Point|B
Frewhurst|A
Fumar|B
Gairloch (Richmond)|AS
Galbraith|AS
Galway Downs|BS
Garbutt|B
Gargett|B
Garradunga|B
Geeberga|B
Geera|B
Gemoka (Richmond)|AS
Georgetown|AS
Georgina|A
Gilbert River|AS
Gilberton (Etheridge Shire)|AS
Gilgies|B
Gilliat (Julia Creek)|A
Gillies|B
Gilpeppee Outstation|BS
Ginburra|A
Giru|B
Glen Allen|B
Glen Avon|B
Glen Dillon|B
Glen Isla (Mt Isa)|A
Glen Lyon (Richmond)|A
Glenariff|B
Glendilla|BS
Glenden|B
Glenella|B
Glengarry|B
Glengyle|AS
Glenmore (Winton)|BS
Glenore|AS
Glenormiston|AS
Glenray Scour Siding|B
Glenstuart|B
Glenusk|B
Gloucester Island|B
Golden Gate Creek (Croydon)|AS
Golden Grove|B
Goldsborough|B
Goolboo|B
Goolburra|B
Goombie|B
Goondi|B
Goondi Bend|B
Gordonvale|B
Gowan|BS
Grampian Hills|AS
Granada|A
Grasstree Beach|B
Great Palm Island (Palm Isles Group)|BS
Greenmount (near Mackay)|B
Greenvale|B
Gregory Downs|AS
Gregory River (near Proserpine)|B
Gregory Springs|BS
Gueyan|B
Gulliver|B
Gumahah (Cunnamulla)|BS
Gumbardo|B
Gumlu|B
Gunjoola|A
Gunnawarra|B
Gunpowder|A
Gunyarra|B
Gurrumbah|A
Guthalunga|B
Habana|B
Halifax|B
Hallbrook|B
Hamilton Downs|AS
Hamilton Hotel|AS
Hamilton Island|B
Hamilton Park|B
Hammond Downs|BS
Hammond Island|AS
Hampden|B
Hampden Mine (Mt Isa)|A
Hampstead|AS
Hanley|B
Happy Bay|B
Happy Valley (Mt Isa)|B
Hardington|B
Harvest Home|B
Harvey Creek|B
Haughton Vale|B
Haughton Valley|B
Havilah|B
Hawkins Creek (Ingham)|B
Hay Point|B
Haydon|AS
Hayman|B
Hazeleigh|B
Hazelmere (Aramac)|B
Hazelmere (Normanton)|AS
Headingly|A
Headingly Station|A
Healy|A
Heatley|B
Hector|B
Heidelburgh|B
Helen Vale|AS
Helens Hill|B
Hematite|A
Henley Park|B
Herbert Downs|AS
Herbert Vale|AS
Herberton|B
Hermit Park|B
Hermitage (Paroo)|B
Hervey Range|B
Hewitt|B
Hinchinbrook Island|B
Hidden Valley (near Paluma)|B
Highbury|AS
Highlands|B
Hill Crest|B
Hillalong|B
Hilltop (Richmond)|BS
Hillview Park|B
Hilton|A
Hodel|B
Hoganthulla Downs|B
Holloways Beach|B
Home Hill|B
Homebush (Aramac)|B
Homestead|B
Homevale|B
Hope Vale|A
Horn|AS
Horn Island|AS
Horseshoe Bay|B
Howick Group|AS
Hughenden|BS
Hulton|B
Humeburn|B
Hungerford|B
Hyde Park|B
Hydro|B
Idalia (near Blackall)|B
Idalia (near Croydon)|AS
Iffley|AS
Ilbilbie Railway Station and Post Office|B
Ilfracombe|B
Illalong|B
Indina|A
Ingham|B
Injinoo|AS
Ingle Downs|B
Ingledoon|AS
Inglewood (Murweh)|B
Inkerman (Cape York)|AS
Inkerman (Home Hill)|B
Inneston|B
Innisfail|B
Innisfail Estate|B
Innot Hot Springs|B
Inverleigh|AS
Inveroona (Bowen)|B
Iron Range|AS
Ironhurst|AS
Irvinebank|B
Isis Downs|B
Isisford|B
Ivanhoe Downs|B
Ivy Leaf|B
Iyah|B
Jackson Oil Fields|BS
Jaffa|B
Jaggan|B
Jansen|A
Japponvale|B
Jaraga|B
Jardine Valley|B
Jarvisfield|B
Jedburgh|B
Jensen|B
Jessievale|A
Jethro|B
Jogo|B
Jubilee Pocket|B
Julago|B
Julatten|B
Julia Creek|AS
Jundah|B
Jungara|B
Kaampa|A
Kaban|B
Kahmoolunga|B
Kairi|B
Kajabbi|A
Kalamia|B
Kalboona|BS
Kalkah|AS
Kalmeta|AS
Kalunga|B
Kamaran Downs|AS
Kamarga|AS
Kambul|B
Kamerunga|B
Kamilori|AS
Kamma|B
Kamo|B
Kanalba|B
Kangaroo Hills|B
Kanimbla|B
Kanimbla Heights|B
Karoon|B
Karremal|B
Karto|B
Karumba|AS
Katoora|B
Keebah|B
Keeroongooloo|BS
Kelsey Creek|B
Kelso|B
Kemmis|B
Kennedy|B
Kensingdon Downs|B
Kewarra Beach|B
Kidston|AS
Kihee|BS
Killymoon|B
Kimba|AS
Kimburra|B
Kimileroi|AS
Kinchant Dam|B
Kinduro|B
King Junction|AS
Kingle|AS
Kingsborough|B
Kinrara|B
Kirwan|B
Koah|B
Koberinga|B
Kongula|A
Konupa|B
Kookuna|B
Koolachu|B
Koolamarra|A
Koolatah|AS
Koombooloomba|B
Koorboora|A
Kooroora|A
Kopi|B
Koumala|B
Kowanyama|AS
Kowari|B
Kubill|B
Kulara|B
Kulburn|B
Kulki|BS
Kundora|A
Kungurri|B
Kuranda|B
Kureen|B
Kuridala|A
Kurrajong (Murweh)|B
Kurrajong (Paroo)|B
Kurrimine Beach|B
Kurukan|B
Kuttabul|B
Kyabra|BS
Kyburra|B
Kynuna|AS
Kyong|B
Lake Barrine|B
Lake Dunn|B
Lake Eacham|B
Lake Pure|BS
Lakefield|AS
Lakeland (near Cooktown)|A
Lamond|B
Lana|B
Lancelot|B
Lancevale|B
Langdon (Mackay)|B
Langlo Crossing|B
Lannercost Extension|B
Lansdowne|B
Lappa|A
Laudee|B
Laura|A
Lava Plains|B
Lawn Hill|AS
Leafgold|B
Leichhardt Farms|B
Lemonside|B
Lenton Downs|B
Lerida|B
Letherbrook|B
Lilleyvale|BS
Lilypond|B
Lindeman Group|B
Listowel Downs|B
Little Mulgrave|B
Lizard Island|AS
Llanrheidol|BS
Locherbie|AS
Lochiel|BS
Lochinvar|B
Lochnagar (Barcaldine)|B
Lochnagar (Cape York)|AS
Lockhart River|AS
Loddon|B
Loloma|B
Lolworth|B
Londford|B
Long Island (Proserpine)|B
Long Pocket|B
Longara|A
Longford Creek|B
Longreach|B
Longton|B
Lorraine|AS
Lorrett Downs|AS
Lotus Vale|AS
Louisiana|AS
Lower Tully|B
Lucinda|B
Lucknow|AS
Lucky Downs|B
Lucy Creek|B
Ludgate Hill|B
Lumburra|B
Lurnea (Charleville)|B
Lyndbrook|A
Lyndhurst (Etheridge)|AS
Lynwood|BS
Maadi|B
Mabuiag Island|AS
Macaroni|AS
Macdesme|B
Machans Beach|B
Mackay|B
Mackay Harbour|B
Macknade|B
Mackunda Downs|BS
Macrossan|B
Mafeking|B
Maggieville|AS
Magnetic Island|B
Magowra|AS
Maida Vale|B
Maitland Downs|A
Majors Creek|B
Malagarga|BS
Malanda|B
Malbon|A
Malbon Vale|A
Malboona|B
Malta|B
Malvern Hills|B
Malverton|B
Mandalay|B
Mandalee|B
Maneroo|B
Mangalore|B
Manoa|B
Manoora|B
Mantaka|B
Manton|B
Manuka (Winton)|BS
Manunda|B
Mapalo|B
Mapee|B
Mapoon|AS
Maraju|B
Marali|B
Marathon|BS
Mareeba|B
Marian|B
Marimo|A
Marina Plains|AS
Marion Downs|AS
Maroo|BS
Marooka|B
Marraba|A
Marton|AS
Martynvale|B
Marwood|B
Mary Kathleen|A
Maryvale (Murweh)|B
Maryvale Springs|B
Mavis Downs|B
Maxwelton|AS
Mayne Downs|BS
Mayne Hotel|BS
Mayneside|B
Maytown|A
Mcdonnell's Creek|B
Mckinlay|A
Meadow Bank|B
Meeba Downs|BS
Meerawa|B
Mein|AS
Mekaree|B
Mellish (Mt Isa)|AS
Mena Creek|B
Menzies (Mt Isa)|A
Merapah|AS
Merigol|B
Merina Downs|B
Merinda|B
Merluna|AS
Merragallan|B
Mervyndale|B
Meta Vale|B
Metford|B
Mia Mia|B
Miallo|B
Mica Creek|A
Middlebrook|B
Middleton|BS
Midge Point|B
Midgenoo|B
Midgeton|B
Mighell|B
Mikoolu|B
Miles End|A
Milgarra|AS
Millaa Millaa|B
Millaroo|B
Millchester|B
Millstream|B
Millies Walk|B
Millungera|AS
Millwood (Murweh)|B
Milo|B
Min Min|AS
Minbun|B
Minehan|B
Mingela|B
Minnie Downs|B
Miowera|B
Miranda Downs|AS
Mirani|B
Mirriwinni|B
Mirrabooka|B
Mirrigan|B
Mirtna|B
Mission Beach|B
Mission River|AS
Mitchell Mission|AS
Mitchell River|AS
Mittagong|AS
Moa Island|AS
Moble|BS
Molloy|B
Monkira|AS
Mookarra|B
Moombidary|BS
Moomin|B
Moongobulla|B
Mooning|BS
Mooraberree|AS
Moorak|B
Mooroobool|B
Mopo|B
Moregatta|B
Morella|B
Moresby|B
Moreton (Far North Queensland)|AS
Mornington (near Mt Isa)|A
Mornington Island|AS
Morrena|B
Morris Island|AS
Morston|A
Moruga|B
Morven|B
Moselle|BS
Moselle Downs|AS
Mosman Park|B
Mossman|B
Mowbray|B
Mowbray River|B
Mowo|B
Mount Aberdeen|B
Mount Buckley|B
Mount Carbine|B
Mount Castor|B
Mount Charlton|B
Mount Christian|B
Mount Convenient|B
Mount Coolon|B
Mount Cuthbert|A
Mount Dalrymple|B
Mount Dangar|B
Mount Dore (Cloncurry)|AS
Mount Elsie|B
Mount Emu Plains|B
Mount Etna|B
Mount Fox|B
Mount Garnet|B
Mount Howitt|BS
Mount Isa|A
Mount Jukes|B
Mount Julian|B
Mount Kelly|B
Mount Leonard (Diamantina)|AS
Mount Lookout|B
Mount Louisa|B
Mount Low|B
Mount Margaret|BS
Mount Maria|B
Mount Marlow|B
Mount Martin|B
Mount Mcconnell|B
Mount Molloy|B
Mount Morris|B
Mount Mulgrave|AS
Mount Mulligan|A
Mount Norman|AS
Mount Ossa|B
Mount Oxide|A
Mount Pelion|B
Mount Peter|B
Mount Pleasant (near Mackay)|B
Mount Ravenswood|B
Mount Sheridan|B
Mount Sophia|B
Mount Spec|B
Mount Sturgeon|BS
Mount Surprise|A
Mount Turner|AS
Mourilyan (Innisfail)|B
Mulei|B
Mumu|BS
Munbura|B
Munburra|AS
Muncoonie|AS
Mundic Creek|B
Mundingburra|B
Mundoo|B
Munduran Station|BS
Mungana|A
Mungumburra|B
Murra Murra|B
Murrabit|B
Murravale|B
Murray Upper|B
Murrigal|B
Murweh|B
Musgrave|AS
Mutarnee|B
Mutchilba|B
Muttaburra|B
Myendetta|B
Mylrea Downs|AS
Myola (Cairns)|B
Mysterton|B
Nabilla|B
Naccowlah|BS
Nammon|BS
Namoi|B
Nanum|AS
Nanyima|B
Nappa Merrie|BS
Napranum|AS
Naraku|A
Nardoo (Cunnamulla)|B
Nardoo Station|AS
Naryilco|BS
Natal Downs|B
Nebine|B
Nebo|B
Needlewood|B
Nelia|AS
Nelly Bay|B
Nerada|B
Netherdale|B
Neumayer Valley|AS
Never Fail|B
New Bamboo|AS
New Mapoon|AS
Newark|B
Newbury Junction|B
Newell|B
Newlands|B
Nightjar|B
Nimaru|B
Nimboy|B
Nindaroo|B
Ningaling|B
Ninian Bay|AS
Nive Downs|B
Noccundra|BS
Nockatunga|BS
Noella|B
Nolan Creek|A
Nombardie|B
Nome|B
Nonda|AS
Nooraloo|B
Noorlah|B
Nooyeah Downs|BS
Norah Park|B
Norfolk|A
Normanby (Cooktown Line)|A
Normanton|AS
North Mackay|B
North Ward|B
Northampton Downs|B
Nottingham Downs|BS
Nowranie|A
Nuken|BS
Numil Downs|AS
Nunkumbril|B
Nychum|A
Nyleta|B
Nymbool|B
Nymph Island|AS
O'Connel River|B
Oak Forest|B
Oak Park|AS
Oak Valley|B
Oakdale (Mackay)|B
Oakenden|B
Oakham|BS
Oakland Park (Normanton)|AS
Oakvale|B
Oakwood (Charleville)|B
Oamaru|AS
Oatann|A
Oban|A
Offham|B
Okuloo|B
Old Kyra|BS
Old Silver Plains|A
Olio|B
One Tree Island|N
Oona|A
Oondooroo|B
Oonooie|B
Oonoonba|B
Oontoo (Kynuna)|AS
Ooralea|B
Oorindi|A
Opah|A
Opalton|B
Opalville|B
Ophir|BS
Ord|A
Orient|BS
Orientos|BS
Orkadilla|B
Orpheus Island (Palm Isles Group)|BS
Osborne|B
Osborne Mine|AS
Otterburn|B
Ouchy|AS
Ouida Downs|B
Owen's Creek|B
Oxford Downs|B
Packers Camp|B
Paget|B
Pakula|B
Pallarenda|B
Palm Cove|B
Palm Island (Palm Isles Group)|BS
Palm Isles Group|BS
Palma|B
Palmerston|B
Palmerville|AS
Palms|B
Palmyra|B
Palparara|BS
Paluma|B
Panama Downs|AS
Parada|B
Parapi|B
Parkgate|B
Parkside (near Mt Isa)|A
Parramatta Park|B
Partingtons Siding|B
Pascarel|B
Pawngilly|B
Payne|B
Peeramon|B
Pelorus Island (Palm Isles Group)|BS
Penola Downs|A
Pentland|B
Percol Plains|A
Petford|A
Phillott|B
Philps Siding|B
Phosphate Hill|AS
Picnic Bay|B
Piemont|B
Pimlico|B
Pindi Pindi|B
Pingine|B
Pinkenetta|BS
Pinkilla|BS
Pinnacle (near Charleville)|B
Pioneer (near Mt Isa)|B
Piralko|B
Piturie|A
Plane Creek|B
Planet Downs|BS
Plevna Downs (Eromanga)|BS
Plevna Downs (Augathella)|B
Pleystowe|B
Plum Tree|B
Poitrel|B
Pokara|A
Politic|B
Pormpuraaw|AS
Poopoonbah|B
Port Douglas|B
Portsmith|B
Portland Downs|B
Possamunga|BS
Potosi|B
Powlathanga|B
Prairie|B
Prairievale|B
Preston (near Proserpine)|B
Prestwood|AS
Prince Of Wales Island|AS
Princess Hill|B
Proserpine|B
Prubi|B
Prudhoe Island|B
Pudilliba|B
Punjaub|AS
Purono|B
Pymurra|A
Pyramid|B
Quamby|A
Quarrel's|AS
Quatia|B
Quealban|B
Queen's Road|B
Queens Beach (Bowen)|B
Queenton|B
Queerah|B
Quilberry|B
Quilpie|B
Quingilli|B
Racecourse|B
Racecourse Lagoon|AS
Racecourse Mill|B
Railway Estate|B
Rainscourt|AS
Ramleh|B
Rangelands|B
Rangers Valley|B
Rangewood|B
Rasmussen|B
Ravensbath|B
Ravenscourt (Charleville)|B
Ravenshoe|B
Ravenswood|B
Ray|BS
Raymore|BS
Red Cliffe Vale|B
Red Hill (Nebo)|B
Redlynch|B
Reedy Springs|B
Reid River|B
Retreat|B
Richmond (near Hughenden)|AS
Richmond (near Mackay)|B
Richmond Hill (Barcaldine)|B
Richmond Hill (Charters Towers)|B
Rimbanda|B
Ringwood Park|A
Riordanvale|B
Riple Creek|A
Rita Island|B
River View|B
Riverdale (Richmond)|A
Riversleigh|B
Robinhood|AS
Rockingham|B
Rocklands|A
Rocklea (Barcaldine)|B
Rockwood (Hughenden)|B
Rocky Point (near Weipa)|AS
Rocky Point (near Mossman)|B
Rodney Downs|B
Rokeby|AS
Rolling Downs (Richmond)|A
Rollingstone|B
Rollo|B
Ronlow Park|B
Roseberth|AS
Roseburn|B
Rosella|B
Roseneath (Townsville)|B
Rosevale (Nebo)|B
Rosslea|B
Ross River|B
Rossville|A
Rowes Bay|B
Roxborough Downs|AS
Rumula|B
Rungoo|B
Rural View|B
Russleigh|B
Ruthven|B
Rutland Plains|AS
Ryandale|B
Saibai Island|AS
Salas Siding|B
Saltern|B
Sandiford|B
Sandringham (Bedourie)|AS
Sarina|B
Sarina Beach|B
Sarina Range|B
Saunders Beach|B
Savannah Downs|AS
Saxby Downs|AS
Scart Water|B
Scawfell Island|B
Scottville|B
Scrubview|B
Seaforth|B
Sedan|B
Seisia|AS
Sellheim|B
Selwyn|A
Septimus|B
Sesbania|BS
Seymour (Innisfail)|B
Shady Downs|B
Shaw|B
Shinfield|B
Shiptons Flat|AS
Shoal Point|B
Silent Grove|B
Silkwood|B
Silky Oak Creek|B
Silver Plains|AS
Slade Point|B
Smithfield (Cairns)|B
Solanum|B
Soldiers Hill|A
Somerset|AS
Sommariva|B
South Galway|BS
South Glen (Paroo)|B
South Johnstone|B
South Mackay|B
South Molle|B
Southedge|B
Southern Cross|B
Speewah|B
Split Rock|A
Springcliff|B
Springvale|B
Springvale (Diamantina)|AS
St Helens Beach|B
St Patricks Island|A
St Ronans|A
Stamford|BS
Stanbroke|A
Stanley|B
Stannary Hills|B
Starcke|AS
Stirling (Aramac)|BS
Stonehenge (near Longreach)|B
Stoney Creek|B
Storth|B
Stratford|B
Stratford Siding|B
Strathbowen|BS
Strathburn|AS
Strathdarr|B
Strathdickie|B
Strathfield (Mckinlay)|A
Strathfillan|B
Strathgordon (Cape York)|AS
Strathhaven|AS
Strathleven|AS
Strathmay|AS
Strathmore (Longreach)|B
Strathmore (Normanton)|AS
Stuart|B
Stuartstown|A
Sturt|AS
Sugarloaf (near Proserpine)|B
Sundown|A
Sunset|A
Sunnyside (near Mackay)|B
Swan Vale|B
Sybil Creek|B
Sydenham|B
Tabacum|B
Table Top|AS
Talaroo|AS
Talawanta|AS
Talbalba|B
Talmoi|AS
Tambo|B
Tanbar|BS
Tangorin|B
Tannalo|B
Tarabah|B
Tarbrax (Julia Creek)|AS
Tarcombe|B
Tareen|B
Tarren Lake|B
Tarvano|BS
Tarzali|B
Tate Tin Mines|A
Taylors Beach|B
Te Kowai|B
Tego|B
Tenham|BS
Tepon|B
Terang|B
Terranburby|B
Terrick|BS
Terwood|A
Thalanga|B
Thargomindah|BS
The Gap (Mt Isa)|A
The Horn|A
The Lake (Aramac)|B
The Leap|B
The Lynd|AS
The Monument (Mt Isa)|AS
The Oaks|AS
The Weir|B
Thirlestone|B
Thishebank|B
Thoopara|B
Thornborough|B
Thunda|B
Thuringowa Central|B
Thursday Island|AS
Thurulgoonia|B
Thylungra|BS
Tierawomba|B
Tilbooroo|BS
Timora|AS
Tinaroo|B
Tinaroo Falls|B
Tinnenburra|B
Tiree|B
Tobermorey|BS
Tokalon|B
Toko|AS
Tolga|B
Tolkuru|B
Toll|B
Tomahawk|BS
Tonkoro|B
Toobanna|B
Toolakea|B
Toolebuc|AS
Toomba|B
Toompine Station (Quilpie)|BS
Toonka Outstation|AS
Toonpan|B
Toorak (Cloncurry)|AS
Topaz|B
Torquay (Richmond)|BS
Torrens Creek|B
Torres Park|B
Torres Strait Islands|AS
Townsville|B
Townview|A
Towri (Richmond)|AS
Trafalgar|B
Tralee (Flinders)|BS
Trebonne|B
Tregoning|B
Trekalano|A
Trewalla|B
Trinidad|BS
Trinity Beach|B
Trinity Park|B
Trueman|B
Trunding|AS
Tuen|B
Tula|B
Tully|B
Tully Heads|B
Tulmur|BS
Tumbare|B
Tumoulin|B
Turkinje|B
Turnorville|B
Turulka|B
Ularunda|B
Ulcanbah|B
Ulgulu|B
Ulva|B
Undilla|A
Undina|A
Ungo|B
Union Mills|A
Upper Barron|B
Upper Murray River|B
Upper Stone|B
Urama|B
Urana West|B
Urandangi|A
Urani|B
Urannal|B
Urquhart|B
Uruba|B
Valley Of Lagoons|B
Valparaiso|BS
Van Rook|AS
Vaparaiso|B
Vergemont|B
Victoria|B
Victoria Downs|B
Victoria Estate|B
Victoria Park (Mackay)|B
Victoria Plains|B
Villa Dale (Richmond)|AS
Vince|B
Vincent|B
Violet Vale|AS
Wagodra|B
Waitan|AS
Waitara|B
Wakala|B
Walgra|A
Walkamin|B
Walkerston|B
Wallal|B
Walsh|A
Wambiana|B
Wando Vale|B
Wandoo|B
Wangan|B
Wanko|B
Wanora Downs (Richmond)|AS
Wanora Downs (Winton)|BS
Warbreccan|B
Warburton|AS
Warenda|AS
Warianna|BS
Warrabin|BS
Warrambah|B
Warreah|B
Warren Vale|AS
Warrigal|B
Warringah Station|BS
Warrnambool Downs|B
Warrubullen|B
Warterview|B
Watson Island|AS
Watsonville|B
Watten|BS
Waugh's Pocket|B
Waverley|A
Waverney|BS
Webb|B
Weelamurra|B
Weerimba|B
Weewondilla|B
Weipa|AS
Welcome (Georgetown)|AS
Wellesley Islands|AS
Wellshot|B
Weona (Paroo)|B
Weonia (Balonne)|B
Werewilka|BS
Werna|B
Werona|B
Werrington|AS
West Moreland|AS
Westbourne|B
Westcourt|B
West End (Townsville)|B
West Mackay|B
Westgate|B
Westland|B
Westlea|B
Wetherby (Richmond)|AS
Wetherby (Winton)|BS
Wetlands|B
White Rock (Cairns)|B
Whitewood|BS
Whitfield|B
Whitsunday Island|B
Why Not (Mackay)|B
Why Not (Quilpie)|BS
Widgeegoara|B
Willis Island|AS
Wills|AS
Wilmington|B
Wilson Bay|AS
Winchester Downs (Richmond)|AS
Windeyer|B
Windorah|BS
Winhaven|B
Winston|A
Winton|B
Wirpoo|B
Wirra–Wirra (Georgetown)|AS
Woepen|A
Woldston|B
Wolfram|A
Wollingford|B
Wombat (Winton)|BS
Wondecla|B
Wondoola|AS
Wonga|B
Wonga Beach|B
Wongabel|B
Wongalee|B
Wongaling Beach|B
Wongamere|B
Wontimee|A
Woodstock (near Croydon)|AS
Woodstock (near Townsville)|B
Woodvale (Cunnamulla)|B
Woodville|A
Woodwark|B
Woolahra|B
Woonigan|A
Woonoona|B
Wooroorooka|B
Woree|B
Wrights Creek (Cloncurry)|A
Wrotham Park|AS
Wulguru|B
Wundaru|B
Wujal Wujal (near Cooktown)|A
Wyandotte|B
Wyandra|B
Wybenia|B
Wyeroo Outstation|AS
Wyoming (Ingham)|B
Wyreema Downs|AS
Yabulu|B
Yacamunda|B
Yadjin|B
Yakapari|B
Yakara|BS
Yalamurra|B
Yalboroo|B
Yalkula|B
Yalleroi|B
Yam Island|AS
Yambungan|A
Yandarlo|B
Yanna|B
Yaraka|B
Yarrabah|B
Yarraden|AS
Yarrowmere|B
Yarrum|AS
Yatee|B
Yenloora Station|BS
Yenoor|B
Yeolands|B
Yoomoo|A
York Downs|AS
Yorke Island|AS
Yorkey's Knob|B
Yowah|BS
Yukan|B
Yungaburra|B
Yunnerman|B
Yurbi|A
Yurunga|B
Zelma|B
`;
