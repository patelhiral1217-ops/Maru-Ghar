/* Supplemental complete UI translation layer. It only translates known interface phrases;
   user-entered property/customer content is intentionally excluded. */
(()=>{
  const dict={
    'મારું ઘર':'मेरा घर|Maru Ghar','મારું':'मेरा|Maru','ઘર':'घर|Home',
    'સેટિંગ્સ':'सेटिंग्स|Settings','⚙ સેટિંગ્સ':'⚙ सेटिंग्स|⚙ Settings','👤 એકાઉન્ટ':'👤 खाता|👤 Account','બંધ કરો':'बंद करें|Close',
    '🌐 સમગ્ર ગુજરાતનું નેટવર્ક':'🌐 पूरे गुजरात का नेटवर्क|🌐 Gujarat-wide Property Network',
    'તમારા શહેરની પ્રોપર્ટી જોવા માટે જિલ્લો પસંદ કરો.':'अपने शहर की प्रॉपर्टी देखने के लिए जिला चुनें।|Choose a district to view properties in your city.',
    '＋ નેટવર્કમાં જોડાઓ':'＋ नेटवर्क से जुड़ें|＋ Join the Network',
    'શહેર પસંદ કરતાં ઉપલબ્ધ મંજૂર પ્રોપર્ટી લિસ્ટિંગ ફિલ્ટર થશે. નવા શહેરો એડમિન દ્વારા ઉમેરાઈ શકે છે.':'शहर चुनने पर उपलब्ध स्वीकृत प्रॉपर्टी लिस्टिंग फ़िल्टर होंगी। नए शहर एडमिन जोड़ सकते हैं।|Selecting a city filters approved property listings. Admins can add new cities.',
    'ગાંધીનગર':'गांधीनगर|Gandhinagar','અમદાવાદ':'अहमदाबाद|Ahmedabad','સુરત':'सूरत|Surat','વડોદરા':'वडोदरा|Vadodara','રાજકોટ':'राजकोट|Rajkot','ભાવનગર':'भावनगर|Bhavnagar','જામનગર':'जामनगर|Jamnagar','જૂનાગઢ':'जूनागढ़|Junagadh','આણંદ':'आनंद|Anand','મહેસાણા':'मेहसाणा|Mehsana','પાટણ':'पाटन|Patan','ભરૂચ':'भरूच|Bharuch',

    'વિસ્તાર અથવા પ્રોપર્ટી શોધો':'क्षेत्र या प्रॉपर्टी खोजें|Search area or property',
    'આધુનિક અને સુંદર રહેઠાણ':'आधुनिक और सुंदर आवास|Modern and Beautiful Homes',
    'વ્યવસાય માટે યોગ્ય જગ્યા':'व्यवसाय के लिए उपयुक्त जगह|Suitable Space for Business',
    'પ્રોપર્ટી શોધ સહાય':'प्रॉपर्टी खोज सहायता|Property Search Help',
    'કાર્ડ દૃશ્ય':'कार्ड दृश्य|Card View',
    'વેરિફાઇડ પ્રોપર્ટી':'सत्यापित प्रॉपर्टी|Verified Property',
    '₹ ઓછામાં ઓછું':'₹ कम से कम|₹ Minimum',
    'ન્યૂનતમ ભાવ':'न्यूनतम कीमत|Minimum Price',
    '₹ વધુમાં વધુ':'₹ अधिकतम|₹ Maximum',
    'મહત્તમ ભાવ':'अधिकतम कीमत|Maximum Price',
    'ક્રમ':'क्रम|Sort Order',
    'પ્રોપર્ટી શોધવાની પ્રક્રિયા':'प्रॉपर्टी खोजने की प्रक्रिया|How to Find a Property',
    'તમારો ઈમેલ':'आपका ईमेल|Your Email',
    'ઓછામાં ઓછા 6 અક્ષર':'कम से कम 6 अक्षर|At least 6 characters',
    'ઝડપી મેનુ':'त्वरित मेनू|Quick Menu',
    'જેમ કે ₹15,000 / મહિનો':'जैसे ₹15,000 / महीना|e.g. ₹15,000 / month',
    'આ સુવિધા Firebase સાથે જોડાયેલી છે. index.html સીધી ફાઇલ તરીકે ખોલવાથી Firebase Login, ડેટા, અપલોડ અને Sync ચાલતા નથી. HTTPS વેબસાઇટ અથવા ઇન્સ્ટોલ કરેલી APK ખોલો.':'यह सुविधा Firebase से जुड़ी है। index.html को सीधे फ़ाइल के रूप में खोलने पर Firebase Login, डेटा, अपलोड और Sync काम नहीं करते। HTTPS वेबसाइट या इंस्टॉल की गई APK खोलें।|This feature uses Firebase. Opening index.html directly as a file does not support Firebase login, data, uploads or sync. Open the HTTPS website or installed APK.',
    'સ્થિતિ પ્રમાણે ફિલ્ટર':'स्थिति के अनुसार फ़िल्टर|Filter by Status',

    'પ્રોપર્ટી ઉમેરવા માટે અહીં ક્લિક કરો':'प्रॉपर्टी जोड़ने के लिए यहाँ क्लिक करें|Click here to add a property',
    'આ index.html ફાઇલ સીધી ફોન/કમ્પ્યુટરમાંથી ખોલેલી છે. ભાષા અને સામાન્ય પેજ દેખાઈ શકે છે, પરંતુ Firebase Login, લાઇવ લિસ્ટિંગ, ફોટો/વિડિયો અપલોડ અને એકાઉન્ટ Sync માટે વેબસાઇટની HTTPS લિંક અથવા ઇન્સ્ટોલ કરેલી APK ખોલો.':'यह index.html फ़ाइल सीधे फ़ोन/कंप्यूटर से खोली गई है। भाषा और सामान्य पेज दिख सकते हैं, लेकिन Firebase Login, Live Listings, फोटो/वीडियो अपलोड और Account Sync के लिए वेबसाइट की HTTPS लिंक या इंस्टॉल की गई APK खोलें।|This index.html file is opened directly from a phone/computer. Language and basic page content may appear, but use the website HTTPS link or installed APK for Firebase login, live listings, photo/video uploads and account sync.',
    'ગાંધીનગર, ગુજરાત':'गांधीनगर, गुजरात|Gandhinagar, Gujarat','— સ્થાનિક પ્રોપર્ટી પ્લેટફોર્મ':'— स्थानीय प्रॉपर्टी प्लेटफ़ॉर्म|— Local Property Platform',
    'પ્રોપર્ટી જુઓ':'प्रॉपर्टी देखें|View Properties','પ્રોપર્ટી ઉમેરો':'प्रॉपर्टी जोड़ें|Add Property','સંપર્ક':'संपर्क|Contact','એડમિન':'एडमिन|Admin','ગુજરાતી':'गुजराती|Gujarati',
    'તમારા શહેરનું ઘર શોધવાનું સરળ સરનામું':'आपके शहर में घर खोजने का आसान ठिकाना|An easy place to find a home in your city',
    'તમારી જરૂરિયાતનું':'आपकी ज़रूरत का|Your Requirement','અહીં શોધો.':'यहाँ खोजें।|Find it here.',
    'ગાંધીનગર સહિત આખા ગુજરાતમાં ઘર, ફ્લેટ, દુકાન, પ્લોટ, ઓફિસ, વેરહાઉસ અને પી.જી. શોધો — પ્રીમિયમ બિલ્ડિંગ અને પ્રોપર્ટીના વાસ્તવિક ફોટો-લુક સાથે.':'गांधीनगर सहित पूरे गुजरात में घर, फ्लैट, दुकान, प्लॉट, ऑफिस, वेयरहाउस और PG खोजें।|Find homes, flats, shops, plots, offices, warehouses and PGs across Gujarat, including Gandhinagar.',
    'તમારી પ્રોપર્ટી શોધો':'अपनी प्रॉपर्टी खोजें|Find Your Property','ભાડે અથવા વેચાણ':'किराये या बिक्री|Rent or Sale','ભાડે':'किराये पर|For Rent','વેચાણ':'बिक्री|For Sale','બધી કેટેગરી':'सभी श्रेणियाँ|All Categories',
    'ઘર':'घर|House','ફ્લેટ':'फ्लैट|Apartment','દુકાન':'दुकान|Shop','રેસિડેન્શિયલ પ્લોટ':'आवासीय प्लॉट|Residential Plot','કોમર્શિયલ પ્લોટ':'कमर्शियल प्लॉट|Commercial Plot','ઓફિસ':'ऑफिस|Office','વેરહાઉસ':'वेयरहाउस|Warehouse','પી.જી. (PG)':'पीजी (PG)|PG',
    'આખું ગુજરાત':'पूरा गुजरात|All Gujarat','શોધો':'खोजें|Search','નોંધ: મંજૂર થયેલી વાસ્તવિક લિસ્ટિંગ અહીં દેખાશે.':'नोट: यहाँ केवल स्वीकृत वास्तविक लिस्टिंग दिखाई देंगी।|Note: Approved real listings will appear here.',
    'આપનું સપનાનું ઘર':'आपका सपनों का घर|Your Dream Home','ઘર અને ફ્લેટ માટે પસંદગીની પ્રોપર્ટી શોધો':'घर और फ्लैट के लिए पसंदीदा प्रॉपर्टी खोजें|Find selected homes and apartments',
    'ઘર અને ફ્લેટ':'घर और फ्लैट|Homes & Apartments','રહેણાંક પ્રોપર્ટી શોધો':'आवासीय प्रॉपर्टी खोजें|Explore Residential Properties','પ્લોટ અને જમીન':'प्लॉट और ज़मीन|Plots & Land','રેસિડેન્શિયલ અને કોમર્શિયલ':'आवासीय और कमर्शियल|Residential & Commercial','દુકાન અને ઓફિસ':'दुकान और ऑफिस|Shops & Offices','વ્યવસાય માટેની જગ્યા':'व्यवसाय के लिए जगह|Spaces for Business',
    'તમારી પ્રોપર્ટી ઉમેરો':'अपनी प्रॉपर्टी जोड़ें|List Your Property','માલિક તરીકે લિસ્ટિંગ મોકલો':'मालिक के रूप में लिस्टिंग भेजें|Submit a Listing as Owner','પ્રોપર્ટી લિસ્ટિંગ':'प्रॉपर्टी लिस्टिंग|Property Listings','તમારી જરૂર મુજબ કેટેગરી પસંદ કરો.':'अपनी ज़रूरत के अनुसार श्रेणी चुनें।|Choose a category that matches your needs.','લાઇવ લિસ્ટિંગ લોડ થઈ રહ્યું છે...':'लाइव लिस्टिंग लोड हो रही हैं...|Loading live listings...',
    'દૃશ્ય (કોલમ):':'दृश्य (कॉलम):|View (columns):','❤️ મનપસંદ':'❤️ पसंदीदा|❤️ Favorites','BHK: બધા':'BHK: सभी|BHK: All','વેરિફાઇડ: બધી':'सत्यापित: सभी|Verified: All','ફક્ત વેરિફાઇડ':'केवल सत्यापित|Verified Only','વેરિફાઇડ નહીં':'सत्यापित नहीं|Not Verified','ફર્નિચર: બધા':'फर्नीचर: सभी|Furnishing: All','ફર્નિશ્ડ':'फर्निश्ड|Furnished','સેમી ફર્નિશ્ડ':'सेमी फर्निश्ड|Semi-furnished','અનફર્નિશ્ડ':'बिना फर्नीचर|Unfurnished','નવી પહેલાં':'नवीनतम पहले|Newest First','ભાવ: ઓછો પહેલાં':'कीमत: कम पहले|Price: Low to High','ભાવ: વધુ પહેલાં':'कीमत: अधिक पहले|Price: High to Low',
    '2 BHK ફ્લેટ — સેક્ટર 21':'2 BHK फ्लैट — सेक्टर 21|2 BHK Apartment — Sector 21','📍 ગાંધીનગર · સેક્ટર 21':'📍 गांधीनगर · सेक्टर 21|📍 Gandhinagar · Sector 21','₹ 15,000 / મહિનો':'₹ 15,000 / महीना|₹15,000 / month','🚿 2 બાથરૂમ':'🚿 2 बाथरूम|🚿 2 Bathrooms','📞 સંપર્ક કરો':'📞 संपर्क करें|📞 Contact',
    'વધુ પ્રોપર્ટી જુઓ':'और प्रॉपर्टी देखें|View More Properties','આ કાર્ડ ડિઝાઇન બતાવવા માટેનાં નમૂના છે. અહીંની પ્રોપર્ટી વાસ્તવિક ઉપલબ્ધ લિસ્ટિંગ હોવાનો દાવો નથી.':'ये कार्ड केवल डिज़ाइन के नमूने हैं; इन्हें वास्तविक उपलब्ध लिस्टिंग न मानें।|These cards are design samples, not actual available listings.',
    'યોગ્ય પ્રોપર્ટી સુધી પહોંચો — સરળ રીતે':'सही प्रॉपर्टी तक पहुँचें — आसानी से|Find the Right Property — Easily','શોધથી લઈને માલિકનો સંપર્ક કરવા સુધીની પ્રક્રિયા એક જ જગ્યાએ.':'खोज से लेकर मालिक से संपर्क तक की प्रक्रिया एक ही जगह।|From search to contacting the owner, all in one place.',
    'શોધો':'खोजें|Search','વિસ્તાર, બજેટ અને પ્રોપર્ટીના પ્રકાર પ્રમાણે પસંદગી કરો.':'क्षेत्र, बजट और प्रॉपर्टी के प्रकार के अनुसार चुनें।|Choose by area, budget and property type.','તુલના કરો':'तुलना करें|Compare','ફોટા, ભાવ અને ઉપલબ્ધ વિગતો ધ્યાનથી જુઓ.':'फोटो, कीमत और उपलब्ध विवरण ध्यान से देखें।|Review photos, prices and available details.','સંપર્ક કરો':'संपर्क करें|Contact','માહિતી માટે ફોન અથવા WhatsApp દ્વારા પૂછપરછ કરો.':'जानकारी के लिए फोन या WhatsApp से पूछताछ करें।|Call or message on WhatsApp for details.',
    'સાવચેતી: લિસ્ટિંગની ઉપલબ્ધતા, માલિકી અને દસ્તાવેજોની ચકાસણી કર્યા પછી જ વ્યવહાર આગળ વધારો.':'सावधानी: उपलब्धता, स्वामित्व और दस्तावेज़ों की जाँच के बाद ही सौदा आगे बढ़ाएँ।|Caution: Verify availability, ownership and documents before proceeding.',
    'તમારી પ્રોપર્ટી લિસ્ટ કરો':'अपनी प्रॉपर्टी सूचीबद्ध करें|List Your Property','પ્રોપર્ટી ભાડે આપવી છે કે વેચવી છે?':'प्रॉपर्टी किराये पर देनी है या बेचनी है?|Would you like to rent or sell your property?','માલિક પોતાની માહિતી મોકલી શકશે. અંતિમ વેબસાઇટમાં આ લિસ્ટિંગ એડમિનની મંજૂરી પછી જ જાહેર થશે.':'मालिक अपनी जानकारी भेज सकता है। लिस्टिंग एडमिन की मंज़ूरी के बाद ही प्रकाशित होगी।|Owners can submit details. Listings are published only after admin approval.','મદદ માટે ફોન કરો:':'सहायता के लिए कॉल करें:|Call for assistance:',
    'તમારું નામ':'आपका नाम|Your Name','મોબાઇલ નંબર':'मोबाइल नंबर|Mobile Number','વિસ્તાર / સેક્ટર':'क्षेत्र / सेक्टर|Area / Sector','શહેર પસંદ કરો':'शहर चुनें|Select City','પ્રોપર્ટીનો પ્રકાર પસંદ કરો':'प्रॉपर्टी का प्रकार चुनें|Select Property Type','ઘર':'घर|House','ફ્લેટ':'फ्लैट|Apartment','દુકાન':'दुकान|Shop','ભાડે કે વેચાણ?':'किराया या बिक्री?|Rent or Sale?','BHK (વૈકલ્પિક)':'BHK (वैकल्पिक)|BHK (Optional)','અંદાજિત કિંમત / ભાડું':'अनुमानित कीमत / किराया|Estimated Price / Rent','નકશાની લિંક (Google Maps, વૈકલ્પિક)':'मैप लिंक (Google Maps, वैकल्पिक)|Map Link (Google Maps, optional)','ક્ષેત્રફળ (ચો. ફૂટ)':'क्षेत्रफल (वर्ग फुट)|Area (sq. ft.)','માળ (જેમ કે 3 / ગ્રાઉન્ડ)':'मंज़िल (जैसे 3 / ग्राउंड)|Floor (e.g. 3 / Ground)','ફર્નિચર (વૈકલ્પિક)':'फर्नीचर (वैकल्पिक)|Furnishing (Optional)','પાર્કિંગ (વૈકલ્પિક)':'पार्किंग (वैकल्पिक)|Parking (Optional)','પાર્કિંગ છે':'पार्किंग उपलब्ध है|Parking Available','પાર્કિંગ નથી':'पार्किंग उपलब्ध नहीं|No Parking','ડિપોઝિટ (ભાડા માટે)':'डिपॉज़िट (किराये के लिए)|Deposit (for rent)','ભાવ ફક્ત આંકડામાં ₹ (ફિલ્ટર માટે)':'कीमत केवल अंकों में ₹ (फ़िल्टर के लिए)|Price in numbers only ₹ (for filters)',
    '🎉 સ્કીમ / ઑફર (વૈકલ્પિક) — દિવાળી ડિસ્કાઉન્ટ જેવી':'🎉 योजना / ऑफ़र (वैकल्पिक) — जैसे दिवाली छूट|🎉 Scheme / Offer (Optional) — e.g. festive discount','સ્કીમનું નામ (દિવાળી ધમાકો)':'योजना का नाम (दिवाली धमाका)|Offer Name (Festive Offer)','સ્કીમ ક્યાં સુધી':'योजना कब तक|Offer Valid Until','સ્કીમની વિગત (જેમ કે 5% ડિસ્કાઉન્ટ, ફ્રી પાર્કિંગ)':'योजना का विवरण (जैसे 5% छूट, मुफ्त पार्किंग)|Offer Details (e.g. 5% discount, free parking)','પ્રોપર્ટીની વધુ માહિતી':'प्रॉपर्टी की अधिक जानकारी|More Property Details',
    'હું ખાતરી આપું છું કે આ પ્રોપર્ટી લિસ્ટ કરવાની મારી પરવાનગી છે અને મારું સંપર્ક નંબર લોગિન કરેલા રસ ધરાવતા ગ્રાહકો સાથે શેર કરવા સંમતિ આપું છું.':'मैं पुष्टि करता/करती हूँ कि मुझे यह प्रॉपर्टी सूचीबद्ध करने की अनुमति है और लॉगिन किए हुए इच्छुक ग्राहकों के साथ अपना संपर्क नंबर साझा करने की सहमति देता/देती हूँ।|I confirm I am authorized to list this property and consent to sharing my contact number with interested logged-in customers.',
    'પ્રોપર્ટીના ફોટા (ફોટાની સંખ્યા પર કોઈ નક્કી મર્યાદા નથી; દરેક ફોટો 8 MB સુધી)':'प्रॉपर्टी की तस्वीरें (कोई निश्चित संख्या सीमा नहीं; प्रत्येक फोटो 8 MB तक)|Property Photos (no fixed count limit; up to 8 MB each)','એક સાથે અનેક ફોટા પસંદ કરી શકો છો. ફોટાની સંખ્યા પર કોઈ નક્કી મર્યાદા નથી.':'आप एक साथ कई फोटो चुन सकते हैं। फोटो की संख्या की कोई तय सीमा नहीं है।|You can select multiple photos at once. There is no fixed photo count limit.',
    'પ્રોપર્ટીનો વિડિયો (વૈકલ્પિક; MP4/WEBM/MOV, દરેક વિડિયો 25 MB સુધી)':'प्रॉपर्टी का वीडियो (वैकल्पिक; प्रत्येक वीडियो 25 MB तक)|Property Video (optional; up to 25 MB each)','વૈકલ્પિક: MP4/WEBM/MOV, દરેક વિડિયો 25 MB સુધી.':'वैकल्पिक: MP4/WEBM/MOV, प्रत्येक वीडियो 25 MB तक।|Optional: MP4/WEBM/MOV, up to 25 MB per video.','પ્રોપર્ટી મંજૂરી માટે મોકલો':'प्रॉपर्टी मंज़ूरी के लिए भेजें|Submit Property for Approval','આગળ વધો':'आगे बढ़ें|Continue','પાછળ જાઓ':'पीछे जाएँ|Back','હોમ':'होम|Home','લિસ્ટ કરો':'लिस्ट करें|List Property','એકાઉન્ટ':'खाता|Account','નકશાની લિંક (વૈકલ્પિક)':'मैप लिंक (वैकल्पिक)|Map Link (Optional)','ક્ષેત્રફળ (વૈકલ્પિક)':'क्षेत्रफल (वैकल्पिक)|Area (Optional)','માળ (વૈકલ્પિક)':'मंज़िल (वैकल्पिक)|Floor (Optional)','ડિપોઝિટ (વૈકલ્પિક)':'डिपॉज़िट (वैकल्पिक)|Deposit (Optional)','ભાવ (ફિલ્ટર માટે, વૈકલ્પિક)':'कीमत (फ़िल्टर के लिए, वैकल्पिक)|Price (for filters, optional)','સ્કીમનું નામ (વૈકલ્પિક)':'योजना का नाम (वैकल्पिक)|Offer Name (Optional)','સ્કીમ ક્યાં સુધી (વૈકલ્પિક)':'योजना कब तक (वैकल्पिक)|Offer Valid Until (Optional)','સ્કીમની વિગત (વૈકલ્પિક)':'योजना का विवरण (वैकल्पिक)|Offer Details (Optional)','માલિકીની સંમતિ':'मालिक की सहमति|Owner Consent','પ્રોપર્ટીના ફોટા':'प्रॉपर्टी की तस्वीरें|Property Photos','પ્રોપર્ટીનો વિડિયો (વૈકલ્પિક)':'प्रॉपर्टी का वीडियो (वैकल्पिक)|Property Video (Optional)','અન્ય વિગતો':'अन्य विवरण|Other Details','BHK પસંદ કરો':'BHK चुनें|Select BHK',
    '👤 ગ્રાહક એકાઉન્ટ અને મનપસંદ પ્રોપર્ટી':'👤 ग्राहक खाता और पसंदीदा प्रॉपर्टी|👤 Customer Account & Favorites','એકાઉન્ટ બનાવો અથવા લોગિન કરો. મનપસંદ પ્રોપર્ટી તમારા એકાઉન્ટ સાથે જોડાશે જેથી બીજા ફોનમાં પણ જોઈ શકો.':'खाता बनाएं या लॉगिन करें। पसंदीदा प्रॉपर्टी आपके खाते से जुड़ी रहेगी और दूसरे फोन पर भी दिखेगी।|Create an account or log in. Your favorites will be linked to your account and available on another phone too.','ઈમેલ':'ईमेल|Email','પાસવર્ડ':'पासवर्ड|Password','નવું એકાઉન્ટ બનાવો':'नया खाता बनाएं|Create New Account','લોગિન':'लॉगिन|Log In','લોગઆઉટ':'लॉगआउट|Log Out','મારો ડેટા ડાઉનલોડ':'मेरा डेटा डाउनलोड करें|Download My Data','મારું એકાઉન્ટ ડિલીટ કરો':'मेरा खाता हटाएँ|Delete My Account','ગોપનીયતા નીતિ (Privacy Policy)':'गोपनीयता नीति|Privacy Policy',
    'ભાષા / भाषा / Language':'भाषा / भाषा / Language|Language / भाषा / Language','ભાષા પસંદ કરો':'भाषा चुनें|Select Language','મારું ઘર — Admin Panel':'मेरा घर — Admin Panel|Maru Ghar — Admin Panel','ફક્ત અધિકૃત Admin માટે · પ્રોપર્ટી ઉમેરો, મંજૂર કરો અને ડિલીટ કરો':'केवल अधिकृत Admin के लिए · प्रॉपर्टी जोड़ें, मंज़ूर करें और हटाएँ|Authorized Admin only · Add, approve and delete properties','← મુખ્ય વેબસાઇટ પર પાછા જાઓ':'← मुख्य वेबसाइट पर वापस जाएँ|← Back to Main Website','એડમિન લોગિન':'एडमिन लॉगिन|Admin Login','તમારા અધિકૃત Firebase Email/Password એકાઉન્ટથી પ્રવેશ કરો.':'अपने अधिकृत Firebase Email/Password खाते से लॉगिन करें।|Sign in with your authorized Firebase Email/Password account.','સુરક્ષિત લોગિન':'सुरक्षित लॉगिन|Secure Login','🔔 નોટિફિકેશન ચાલુ કરો':'🔔 नोटिफिकेशन चालू करें|🔔 Enable Notifications','વેબસાઇટ લિંક (શેર કરવા માટે)':'वेबसाइट लिंक (शेयर करने के लिए)|Website Link (for sharing)','તમારી વેબસાઇટની લિંક અહીં એકવાર લખો. લોકો લિસ્ટિંગ શેર કરશે ત્યારે અને પોસ્ટરમાં આ લિંક આવશે.':'अपनी वेबसाइट का लिंक यहाँ एक बार लिखें। लिस्टिंग साझा करने और पोस्टर में यही लिंक आएगा।|Enter your website link once. It will be used when listings are shared and on posters.','વેબસાઇટ લિંક':'वेबसाइट लिंक|Website Link','લિંક સેવ કરો':'लिंक सेव करें|Save Link','🚩 ફરિયાદો':'🚩 शिकायतें|🚩 Reports','શહેરો':'शहर|Cities','નવું શહેર અહીં ઉમેરો એટલે વેબ અને APK બંનેમાં તરત દેખાશે (નવી APK બનાવવાની જરૂર નથી).':'यहाँ नया शहर जोड़ने पर वह वेबसाइट और APK दोनों में तुरंत दिखेगा (नई APK की ज़रूरत नहीं)।|Add a city here to show it immediately on the website and APK (no new APK needed).','શહેરનું નામ (ગુજરાતીમાં)':'शहर का नाम (गुजराती में)|City Name (in Gujarati)','અંગ્રેજી નામ (વૈકલ્પિક)':'अंग्रेज़ी नाम (वैकल्पिक)|English Name (Optional)','શહેર ઉમેરો':'शहर जोड़ें|Add City','જૂની લિસ્ટિંગમાં શહેર લખેલું ન હોય તો એકવાર આ બટન દબાવો:':'पुरानी लिस्टिंग में शहर न हो तो यह बटन एक बार दबाएँ:|If older listings have no city, press this button once:','જૂની લિસ્ટિંગમાં શહેર = ગાંધીનગર સેટ કરો':'पुरानी लिस्टिंग में शहर = गांधीनगर सेट करें|Set city = Gandhinagar for older listings','નવી પ્રોપર્ટી ઉમેરો':'नई प्रॉपर्टी जोड़ें|Add New Property','અહીંથી ઉમેરેલી પ્રોપર્ટી સીધી જાહેર કરવી કે પહેલા પેન્ડિંગ રાખવી તે પસંદ કરો.':'यह चुनें कि यहाँ जोड़ी गई प्रॉपर्टी तुरंत प्रकाशित करनी है या पहले लंबित रखनी है।|Choose whether properties added here are published immediately or kept pending.','માલિકનું નામ':'मालिक का नाम|Owner Name','પ્રોપર્ટીનો પ્રકાર':'प्रॉपर्टी का प्रकार|Property Type','પસંદ કરો':'चुनें|Select','ભાડે કે વેચાણ':'किराया या बिक्री|Rent or Sale','શહેર':'शहर|City','કિંમત / ભાડું':'कीमत / किराया|Price / Rent','નકશાની લિંક (Google Maps, વૈકલ્પિક)':'मैप लिंक (Google Maps, वैकल्पिक)|Map Link (Google Maps, optional)','માળ':'मंज़िल|Floor','ફર્નિચર':'फर्नीचर|Furnishing','પાર્કિંગ':'पार्किंग|Parking','ડિપોઝિટ':'डिपॉज़िट|Deposit','પ્રકાશન':'प्रकाशन|Publishing','ઉમેરતાં જ જાહેર કરો':'जोड़ते ही प्रकाशित करें|Publish Immediately','પહેલા પેન્ડિંગ રાખો':'पहले लंबित रखें|Keep Pending First','આ પ્રોપર્ટી પ્રકાશિત કરવાની અને સંપર્ક નંબર ખાનગી રીતે સાચવવાની પરવાનગી છે.':'मुझे यह प्रॉपर्टी प्रकाशित करने और संपर्क नंबर निजी रूप से सुरक्षित रखने की अनुमति है।|I am authorized to publish this property and store the contact number privately.','📊 રિપોર્ટ અને આંકડા':'📊 रिपोर्ट और आँकड़े|📊 Reports & Statistics','બધા રેકોર્ડથી રિપોર્ટ બનાવો':'सभी रिकॉर्ड से रिपोर्ट बनाएँ|Create Report from All Records','લિસ્ટિંગ CSV એક્સપોર્ટ':'लिस्टिंग CSV एक्सपोर्ट|Export Listings CSV','Excel XLSX એક્સપોર્ટ':'Excel XLSX एक्सपोर्ट|Export Excel XLSX','JSON બેકઅપ Restore':'JSON बैकअप Restore|Restore JSON Backup','JSON બેકઅપ ડાઉનલોડ':'JSON बैकअप डाउनलोड|Download JSON Backup','PDF / પ્રિન્ટ રિપોર્ટ':'PDF / प्रिंट रिपोर्ट|PDF / Print Report','વિગતવાર ફિલ્ટર રિપોર્ટ':'विस्तृत फ़िल्टर रिपोर्ट|Detailed Filter Report','બધા શહેર':'सभी शहर|All Cities','હેતુ':'उद्देश्य|Purpose','ભાડે અને વેચાણ બંને':'किराया और बिक्री दोनों|Rent and Sale','વર્ષ':'वर्ष|Year','બધા વર્ષ':'सभी वर्ष|All Years','મહિનો':'महीना|Month','બધા મહિના':'सभी महीने|All Months','રિપોર્ટ જુઓ':'रिपोर्ट देखें|View Report','ફિલ્ટર રિપોર્ટ CSV':'फ़िल्टर रिपोर्ट CSV|Filtered Report CSV','ફિલ્ટર રિપોર્ટ Excel':'फ़िल्टर रिपोर्ट Excel|Filtered Report Excel','આ રિપોર્ટ પ્રિન્ટ / PDF':'यह रिपोर्ट प्रिंट / PDF करें|Print / PDF This Report','ફિલ્ટર પસંદ કરીને રિપોર્ટ જુઓ.':'फ़िल्टर चुनकर रिपोर्ट देखें।|Select filters and view the report.','🔐 માલિકના મોબાઇલ નંબરની ખાનગી સુરક્ષા':'🔐 मालिक के मोबाइल नंबर की गोपनीय सुरक्षा|🔐 Owner Mobile Number Privacy','જૂની લિસ્ટિંગમાં રહેલા માલિકના મોબાઇલ નંબરને અલગ ખાનગી રેકોર્ડમાં ખસેડો. પહેલાં ખાનગી રેકોર્ડ સાચવાશે, ત્યારબાદ જાહેર લિસ્ટિંગમાંથી નંબર દૂર થશે.':'पुरानी लिस्टिंग के मालिक का मोबाइल नंबर अलग निजी रिकॉर्ड में ले जाएँ। पहले निजी रिकॉर्ड सेव होगा, फिर सार्वजनिक लिस्टिंग से नंबर हटेगा।|Move owner mobile numbers from older listings into private records. The private record is saved before removing the number from public listings.','જૂના મોબાઇલ નંબર સુરક્ષિત કરો':'पुराने मोबाइल नंबर सुरक्षित करें|Secure Old Mobile Numbers','🛠️ સિસ્ટમ Error Log':'🛠️ सिस्टम Error Log|🛠️ System Error Log','Error Log લોડ કરો':'Error Log लोड करें|Load Error Log','Error Log JSON ડાઉનલોડ':'Error Log JSON डाउनलोड|Download Error Log JSON','✉️ ગ્રાહક પૂછપરછ':'✉️ ग्राहक पूछताछ|✉️ Customer Enquiries','ગ્રાહક એકાઉન્ટથી આવેલી પૂછપરછ અહીં દેખાશે.':'ग्राहक खाते से आई पूछताछ यहाँ दिखेगी।|Enquiries from customer accounts will appear here.','પ્રોપર્ટી મેનેજમેન્ટ':'प्रॉपर्टी प्रबंधन|Property Management','બધી સ્થિતિ':'सभी स्थितियाँ|All Statuses','પેન્ડિંગ':'लंबित|Pending','જાહેર / મંજૂર':'प्रकाशित / स्वीकृत|Published / Approved','નામંજૂર':'अस्वीकृत|Rejected','ફરી લોડ કરો':'फिर से लोड करें|Reload','વધુ જૂની લિસ્ટિંગ લોડ કરો':'और पुरानी लिस्टिंग लोड करें|Load Older Listings',
    'ગોપનીયતા નીતિ — મારું ઘર (MARU GHAR)':'गोपनीयता नीति — मेरा घर (MARU GHAR)|Privacy Policy — Maru Ghar','ગોપનીયતા નીતિ':'गोपनीयता नीति|Privacy Policy','મારું ઘર (MARU GHAR) · ગાંધીનગર · છેલ્લો સુધારો: ઓક્ટોબર 2026':'मेरा घर (MARU GHAR) · गांधीनगर · अंतिम संशोधन: अक्टूबर 2026|Maru Ghar · Gandhinagar · Last Updated: October 2026','અમે કઈ માહિતી લઈએ છીએ':'हम कौन-सी जानकारी लेते हैं|What Information We Collect','પ્રોપર્ટી લિસ્ટ કરતી વખતે મકાનમાલિક જે માહિતી આપે છે: નામ, ફોન નંબર, પ્રોપર્ટીનો પ્રકાર, વિસ્તાર, કિંમત, વર્ણન, ફોટા અને વિડિયો. સામાન્ય મુલાકાતીઓ પાસેથી અમે નામ, ફોન કે લોકેશન માંગતા નથી.':'प्रॉपर्टी सूचीबद्ध करते समय मालिक द्वारा दी गई जानकारी: नाम, फोन नंबर, प्रॉपर्टी का प्रकार, क्षेत्र, कीमत, विवरण, फोटो और वीडियो। सामान्य आगंतुकों से हम नाम, फोन या लोकेशन नहीं माँगते।|Information provided by owners when listing a property: name, phone number, property type, area, price, description, photos and videos. We do not ask ordinary visitors for their name, phone or location.','ફોન નંબરની ખાનગી સુરક્ષા':'फोन नंबर की गोपनीय सुरक्षा|Phone Number Privacy','માહિતી ક્યાં સચવાય છે':'जानकारी कहाँ संग्रहीत होती है|Where Information Is Stored','લિસ્ટિંગનો ડેટા Google Firebase (Firestore) માં અને ફોટા/વિડિયો Cloudinary માં સચવાય છે. અમે તમારી માહિતી વેચતા નથી અને જાહેરાત માટે વાપરતા નથી.':'लिस्टिंग का डेटा Google Firebase (Firestore) में और फोटो/वीडियो Cloudinary में संग्रहीत होते हैं। हम आपकी जानकारी बेचते नहीं हैं और विज्ञापन के लिए उपयोग नहीं करते।|Listing data is stored in Google Firebase (Firestore), and photos/videos in Cloudinary. We do not sell your information or use it for advertising.','એપની પરવાનગીઓ':'ऐप की अनुमतियाँ|App Permissions','ગ્રાહક એકાઉન્ટ અને મનપસંદ યાદી':'ग्राहक खाता और पसंदीदा सूची|Customer Account and Favorites','સૂચનાઓ અને ફોલો-અપ':'सूचनाएँ और फॉलो-अप|Notifications and Follow-up','ભાવમાં ઘટાડો અથવા એકાઉન્ટ સંબંધિત સૂચનાઓ તમારા એકાઉન્ટમાં દેખાઈ શકે છે. તમે સૂચનાને વાંચેલી તરીકે ચિહ્નિત કરી શકો છો. પૂછપરછની સ્થિતિ અને ફોલો-અપ નોંધો માત્ર અધિકૃત એડમિન માટે ઉપલબ્ધ છે.':'कीमत में कमी या खाते से संबंधित सूचनाएँ आपके खाते में दिखाई दे सकती हैं। आप सूचना को पढ़ा हुआ चिह्नित कर सकते हैं। पूछताछ की स्थिति और फॉलो-अप नोट केवल अधिकृत एडमिन के लिए उपलब्ध हैं।|Price-drop or account-related notifications may appear in your account. You can mark notifications as read. Enquiry status and follow-up notes are available only to authorized admins.','માહિતી દૂર કરાવવી':'जानकारी हटवाना|Request Data Removal','તમારી લિસ્ટિંગ, ફોન નંબર, ફોટા કે વિડિયો દૂર કરાવવા માટે નીચેના નંબર પર સંપર્ક કરો. ગ્રાહક એકાઉન્ટ ડિલીટ કરવા માટે સાઇટના એકાઉન્ટ વિભાગમાં આપેલ વિકલ્પ વાપરો. અમે યોગ્ય સમયમાં તે દૂર કરીશું.':'अपनी लिस्टिंग, फोन नंबर, फोटो या वीडियो हटवाने के लिए नीचे दिए नंबर पर संपर्क करें। ग्राहक खाता हटाने के लिए साइट के खाते वाले भाग में दिया विकल्प इस्तेमाल करें। हम उचित समय में उसे हटा देंगे।|To remove your listing, phone number, photos or videos, contact the number below. To delete a customer account, use the option in the account section of the site. We will remove it within a reasonable time.','સંપર્ક':'संपर्क|Contact','← મુખ્ય પેજ પર પાછા જાઓ':'← मुख्य पेज पर वापस जाएँ|← Back to Main Page',
    'મારું ઘર — એપ ડાઉનલોડ / QR':'मेरा घर — ऐप डाउनलोड / QR|Maru Ghar — App Download / QR','ગાંધીનગરમાં ઘર, ફ્લેટ, દુકાન, પ્લોટ, ઓફિસ — ભાડે અને વેચાણ':'गांधीनगर में घर, फ्लैट, दुकान, प्लॉट, ऑफिस — किराये और बिक्री के लिए|Homes, flats, shops, plots and offices in Gandhinagar — rent and sale','🌐 વેબસાઇટ / એપ ખોલો':'🌐 वेबसाइट / ऐप खोलें|🌐 Open Website / App','📲 Android APK ડાઉનલોડ કરો':'📲 Android APK डाउनलोड करें|📲 Download Android APK','APK લિંક આપમેળે બની નથી. આ પેજ GitHub Pages પર ખોલશો ત્યારે લિંક બનશે.':'APK लिंक अपने आप नहीं बनी है। यह पेज GitHub Pages पर खोलने पर लिंक बनेगी।|APK link has not been generated automatically. It will appear when this page is opened on GitHub Pages.','APK ઇન્સ્ટોલ કરતી વખતે ફોન "અજાણ્યા સ્ત્રોતમાંથી ઇન્સ્ટોલ" ની પરવાનગી માંગે તો મંજૂર કરો.':'APK इंस्टॉल करते समय फोन "अज्ञात स्रोतों से इंस्टॉल" की अनुमति माँगे तो अनुमति दें।|If your phone asks to allow installation from unknown sources, grant permission.','આ QR સ્કેન કરતાં આ પેજ ખૂલશે, જ્યાંથી વેબસાઇટ ખોલી શકાય અથવા APK ડાઉનલોડ થાય.':'इस QR को स्कैन करने पर यह पेज खुलेगा, जहाँ से वेबसाइट खोली जा सकती है या APK डाउनलोड किया जा सकता है।|Scanning this QR opens this page, where you can open the website or download the APK.','⬇ QR ઇમેજ (PNG) સેવ કરો':'⬇ QR इमेज (PNG) सेव करें|⬇ Save QR Image (PNG)','🖨 પ્રિન્ટ કરો':'🖨 प्रिंट करें|🖨 Print',

    // Premium admin login and dedicated backup settings
    'તમારા અધિકૃત એકાઉન્ટથી સુરક્ષિત રીતે પ્રવેશ કરો':'अपने अधिकृत खाते से सुरक्षित रूप से प्रवेश करें|Sign in securely with your authorized account',
    'સુરક્ષિત પ્રવેશ':'सुरक्षित प्रवेश|Secure Access','ઈમેલ સરનામું':'ईमेल पता|Email Address','સુરક્ષિત લોગિન કરો':'सुरक्षित लॉगिन करें|Sign In Securely',
    '🔒 તમારી માહિતી સુરક્ષિત Firebase Authentication દ્વારા ચકાસાય છે.':'🔒 आपकी जानकारी सुरक्षित Firebase Authentication से सत्यापित होती है।|🔒 Your details are verified securely through Firebase Authentication.',
    'ડેટા બેકઅપ અને રીસ્ટોર':'डेटा बैकअप और रीस्टोर|Data Backup & Restore',
    'તમારી પ્રોપર્ટી લિસ્ટિંગનો બેકઅપ ડાઉનલોડ કરો અથવા અગાઉની બેકઅપ ફાઇલમાંથી રેકોર્ડ પાછા ઉમેરો.':'अपनी प्रॉपर्टी लिस्टिंग का बैकअप डाउनलोड करें या पिछली बैकअप फ़ाइल से रिकॉर्ड वापस जोड़ें।|Download a backup of your property listings or add records from a previous backup file.',
    '⬇️ ડેટાનો બેકઅપ લો (JSON)':'⬇️ डेटा बैकअप लें (JSON)|⬇️ Download Data Backup (JSON)',
    '↻ બેકઅપ રીસ્ટોર કરો':'↻ बैकअप रीस्टोर करें|↻ Restore Backup',
    'ધ્યાન આપો:':'ध्यान दें:|Note:',
    'રીસ્ટોર કરતી વખતે હાલના ID ધરાવતા રેકોર્ડ overwrite નહીં થાય; ફક્ત નવા રેકોર્ડ ઉમેરાશે.':'रीस्टोर करते समय मौजूदा ID वाले रिकॉर्ड ओवरराइट नहीं होंगे; केवल नए रिकॉर्ड जोड़े जाएँगे।|During restore, records with existing IDs will not be overwritten; only new records will be added.',
    'તમારો પાસવર્ડ':'आपका पासवर्ड|Your Password',
    '🏠 મારી પ્રોપર્ટી અને મંજૂરીની સ્થિતિ':'🏠 मेरी प्रॉपर्टी और मंज़ूरी की स्थिति|🏠 My Properties & Approval Status',
    'તમારા લોગિન એકાઉન્ટથી મોકલેલી પ્રોપર્ટી અહીં દેખાશે. નવી લિસ્ટિંગ મોકલતી વખતે લોગિન રહો.':'आपके लॉगिन खाते से भेजी गई प्रॉपर्टी यहाँ दिखेंगी। नई लिस्टिंग भेजते समय लॉगिन रहें।|Properties submitted from your signed-in account appear here. Stay logged in when submitting a new listing.',
    'મારી પ્રોપર્ટી ફરી લોડ કરો':'मेरी प्रॉपर्टी फिर से लोड करें|Reload My Properties',
    'પ્રોપર્ટી જોવા માટે લોગિન કરો.':'प्रॉपर्टी देखने के लिए लॉगिन करें।|Log in to view properties.'
  };
  const cityPairs=[['ગાંધીનગર','गांधीनगर','Gandhinagar'],['અમદાવાદ','अहमदाबाद','Ahmedabad'],['સુરત','सूरत','Surat'],['વડોદરા','वडोदरा','Vadodara'],['રાજકોટ','राजकोट','Rajkot'],['ભાવનગર','भावनगर','Bhavnagar'],['જામનગર','जामनगर','Jamnagar'],['જૂનાગઢ','जूनागढ़','Junagadh'],['આણંદ','आनंद','Anand'],['નડિયાદ','नडियाद','Nadiad'],['મહેસાણા','मेहसाणा','Mehsana'],['કલોલ','कलोल','Kalol'],['મોરબી','मोरबी','Morbi'],['સુરેન્દ્રનગર','सुरेंद्रनगर','Surendranagar'],['ભરૂચ','भरूच','Bharuch'],['વાપી','वापी','Vapi'],['નવસારી','नवसारी','Navsari'],['પાટણ','पाटन','Patan'],['ગોધરા','गोधरा','Godhra'],['પોરબંદર','पोरबंदर','Porbandar'],['ભુજ','भुज','Bhuj'],['અમરેલી','अमरेली','Amreli'],['પાલનપુર','पालनपुर','Palanpur'],['હિંમતનગર','हिम्मतनगर','Himmatnagar'],['દાહોદ','दाहोद','Dahod'],['આહવા','आहवा','Ahwa'],['વલસાડ','वलसाड','Valsad'],['છોટા ઉદેપુર','छोटा उदेपुर','Chhota Udepur'],['મોડાસા','मोडासा','Modasa'],['વિરમગામ','विरमगाम','Viramgam'],['બોટાદ','बोटाद','Botad'],['ધોરાજી','धोराजी','Dhoraji'],['ગોંડલ','गोंडल','Gondal'],['જેતપુર','जेतपुर','Jetpur'],['ઉના','ऊना','Una'],['વેરાવળ','वेरावल','Veraval'],['માંગરોળ','मांगरोल','Mangrol'],['દ્વારકા','द्वारका','Dwarka'],['અંકલેશ્વર','अंकलेश्वर','Ankleshwar'],['ઝઘડિયા','झगड़िया','Jhagadia'],['પાલીતાણા','पालीताना','Palitana'],['ગારીયાધાર','गारियाधार','Gariadhar'],['ધોળકા','धोलका','Dholka'],['સાણંદ','सानंद','Sanand'],['બાવળા','बावला','Bavla'],['દીસા','डीसा','Deesa'],['થરાદ','थराद','Tharad'],['રાધનપુર','राधनपुर','Radhanpur'],['સિદ્ધપુર','सिद्धपुर','Sidhpur'],['વિસનગર','विसनगर','Visnagar'],['ઉંઝા','ऊंझा','Unjha'],['ખેડબ્રહ્મા','खेड़ब्रह्मा','Khedbrahma'],['ઇડર','इडर','Idar'],['પ્રાંતિજ','प्रांतीज','Prantij'],['કડી','कडी','Kadi'],['ચાણસ્મા','चाणस्मा','Chanasma'],['લાખણી','लाखणी','Lakhani']];
  for(const [gu,hi,en] of cityPairs)dict[gu]=`${hi}|${en}`;
  dict['ફોર્મ બંધ કરો']='फ़ॉर्म बंद करें|Close Form';dict['પ્રોપર્ટી ઉમેરો']='प्रॉपर्टी जोड़ें|Add Property';
  /* Merge the central dictionary collected from home, admin, privacy and download pages. */
  if(window.MG_I18N_DICTIONARY){for(const [gu,v] of Object.entries(window.MG_I18N_DICTIONARY)){dict[gu]=`${v.hi||gu}|${v.en||gu}`;}}
  /* Backward compatibility if an older page still provides the original home dictionary. */
  if(window.MG_LANGUAGE_DICTIONARY){for(const [gu,v] of Object.entries(window.MG_LANGUAGE_DICTIONARY)){dict[gu]=`${v.hi||gu}|${v.en||gu}`;}}
  const map={};
  for(const [gu,pair] of Object.entries(dict)){
    const parts=String(pair||'').split('|');
    map[gu]={hi:parts[0]||gu,en:parts[1]||gu};
  }
  const originals=new WeakMap();
  const attrOriginals=new WeakMap();
  // Cache translatable nodes so subsequent language switches avoid a full DOM walk.
  const translatableTextNodes=new Set();
  const translatableAttrElements=new Set();
  let i18nInitialScanDone=false;
  const getSelect=()=>document.getElementById('mgLanguage')||document.getElementById('mgAdminLanguage');
  const lang=()=>{
    const s=getSelect();
    if(s&&['gu','hi','en'].includes(s.value))return s.value;
    try{const saved=localStorage.getItem('mg_language');if(['gu','hi','en'].includes(saved))return saved;}catch(_){}
    return 'gu';
  };
  const entries=Object.entries(map).filter(([gu,v])=>gu&&v).sort((a,b)=>b[0].length-a[0].length);
  const escapeRegExp=value=>String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const makePhraseMatcher=sourceMap=>{
    const keys=Object.keys(sourceMap).filter(Boolean).sort((a,b)=>b.length-a.length);
    if(!keys.length)return value=>String(value??'');
    const pattern=new RegExp('(^|[^A-Za-z0-9\\u0900-\\u097F\\u0A80-\\u0AFF])('+keys.map(escapeRegExp).join('|')+')(?=$|[^A-Za-z0-9\\u0900-\\u097F\\u0A80-\\u0AFF])','gu');
    return value=>String(value??'').replace(pattern,(_match,prefix,phrase)=>prefix+sourceMap[phrase]);
  };
  const reverseMap=Object.create(null);
  for(const [gu,v] of entries){if(v.hi)reverseMap[v.hi]=gu;if(v.en)reverseMap[v.en]=gu;}
  const toGujaratiRaw=makePhraseMatcher(reverseMap);const _bc=new Map();const toGujarati=v=>{const k=String(v??'');let r=_bc.get(k);if(r===undefined){r=toGujaratiRaw(k);if(_bc.size>4000)_bc.clear();_bc.set(k,r)}return r};
  const basePhrasePattern=new RegExp('('+entries.map(([gu])=>escapeRegExp(gu)).join('|')+')','u');const _bpt=new Map();const hasBasePhrase=v=>{let r=_bpt.get(v);if(r===undefined){r=basePhrasePattern.test(v);if(_bpt.size>4000)_bpt.clear();_bpt.set(v,r)}return r};
  const renderers={
    hi:makePhraseMatcher(Object.fromEntries(entries.filter(([gu,v])=>v.hi).map(([gu,v])=>[gu,v.hi]))),
    en:makePhraseMatcher(Object.fromEntries(entries.filter(([gu,v])=>v.en).map(([gu,v])=>[gu,v.en])))
  };
  const renderUncached=value=>{const l=lang();return l==='gu'?String(value??''):(renderers[l]||renderers.gu||((x)=>String(x??'')))(value);};const _rc=new Map();const render=value=>{const s=String(value??'');const l=lang();if(l==='gu')return s;const k=l+'\u0001'+s;let r=_rc.get(k);if(r===undefined){r=renderUncached(s);if(_rc.size>4000)_rc.clear();_rc.set(k,r)}return r};
  /* Keep owner-entered property text unchanged, but never exclude an entire page section/card.
     Buttons and links inside property cards remain translatable. */
  const isUserContent=el=>!!(el&&el.closest&&el.closest('[data-user-content],[contenteditable="true"],textarea,input,[data-owner-text]'));
  const isDynamicRecordBodyText=el=>{
    if(!el||!el.closest)return false;
    const property=el.closest('.property');
    if(property&&property.hasAttribute('data-demo'))return false;
    if(!el.closest('.property,.card,#enquiryList,#listingManager,[data-record-content]'))return false;
    return !el.closest('button,a,[data-i18n],[data-ui-text]');
  };
  const shouldSkipText=n=>{
    const el=n&&n.parentElement;if(!el)return true;
    if(el.closest('script,style,noscript,textarea,input,[contenteditable="true"],#mgLanguage,#mgAdminLanguage,[data-user-content],[data-owner-text]'))return true;
    return isDynamicRecordBodyText(el);
  };
  const shouldSkipAttr=el=>{
    if(!el||!el.closest)return true;
    if(el.closest('#mgLanguage,#mgAdminLanguage,[data-user-content],[data-owner-text],[contenteditable="true"]'))return true;
    return isDynamicRecordBodyText(el);
  };
  function translateNode(node){
    if(!node||node.nodeType!==3||shouldSkipText(node))return;
    const raw=node.nodeValue||'';
    let state=originals.get(node);
    if(!state||raw!==state.last){
      const base=toGujarati(raw);
      if(base===raw&&!hasBasePhrase(raw)) { originals.delete(node);translatableTextNodes.delete(node);return; }
      state={base,last:raw};originals.set(node,state);
    }
    translatableTextNodes.add(node);
    const next=render(state.base);
    state.last=next;
    if(next!==raw)node.nodeValue=next;
  }
  function translateAttrs(el){
    if(!el||el.nodeType!==1||shouldSkipAttr(el))return;
    for(const attr of ['placeholder','title','aria-label']){
      const raw=el.getAttribute(attr);if(raw===null)continue;
      let state=attrOriginals.get(el);if(!state){state={};attrOriginals.set(el,state);}
      if(!state[attr]||raw!==state[attr].last){
        const base=toGujarati(raw);
        if(base===raw&&!hasBasePhrase(raw)){delete state[attr];continue;}
        state[attr]={base,last:raw};
      }
      const next=render(state[attr].base);state[attr].last=next;
      if(next!==raw)el.setAttribute(attr,next);
    }
    const cached=attrOriginals.get(el);
    if(cached&&Object.keys(cached).length)translatableAttrElements.add(el);
  }
  function scan(root=document.body){
    if(!root)return;
    if(root.nodeType===3){translateNode(root);return;}
    if(root.nodeType===1&&root.closest&&root.closest('#mgLanguage,#mgAdminLanguage'))return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;while((node=walker.nextNode()))translateNode(node);
    if(root.querySelectorAll)root.querySelectorAll('button,a,label,[title],[aria-label],[placeholder]').forEach(translateAttrs);
    if(root.nodeType===1)translateAttrs(root);
  }
  let appliedLanguage='';
  const apply=()=>{
    const selected=lang();
    if(!i18nInitialScanDone){
      scan(document.body);
      i18nInitialScanDone=true;
    }else{
      // Repaint cached Gujarati originals; do not rescan the whole page on every switch.
      for(const node of translatableTextNodes){
        if(node.isConnected===false){translatableTextNodes.delete(node);continue;}
        const state=originals.get(node);if(!state)continue;
        const next=render(state.base);
        if(node.nodeValue!==next)node.nodeValue=next;
        state.last=next;
      }
      for(const el of translatableAttrElements){
        if(el.isConnected===false){translatableAttrElements.delete(el);continue;}
        translateAttrs(el);
      }
    }
    appliedLanguage=selected;
    document.documentElement.lang=selected;
    try{localStorage.setItem('mg_language',selected);}catch(_){}
  };
  window.mgI18nText=value=>render(String(value??''));
  window.mgTranslate=window.mgI18nText;
  window.mgAdminTranslate=window.mgI18nText;
  if((document.getElementById('mgAdminLanguage')||document.getElementById('mgLanguage'))&&!window.__mgI18nDialogsBound){
    window.__mgI18nDialogsBound=true;
    const nativeAlert=window.alert?.bind(window),nativeConfirm=window.confirm?.bind(window),nativePrompt=window.prompt?.bind(window);
    if(nativeAlert)window.alert=message=>nativeAlert(window.mgI18nText(message));
    if(nativeConfirm)window.confirm=message=>nativeConfirm(window.mgI18nText(message));
    if(nativePrompt)window.prompt=(message,value)=>nativePrompt(window.mgI18nText(message),value);
  }
  window.mgSetLanguage=value=>{
    if(!['gu','hi','en'].includes(value))return false;
    const s=getSelect();
    const unchanged=appliedLanguage===value;
    if(s)s.value=value;
    try{localStorage.setItem('mg_language',value);}catch(_){}
    if(unchanged)return true;
    apply();window.dispatchEvent(new Event('mg-language-changed'));return true;
  };
  const select=getSelect();
  if(select){
    let saved='gu';try{saved=localStorage.getItem('mg_language')||'gu';}catch(_){}
    if(['gu','hi','en'].includes(saved))select.value=saved;
  }
  const onLanguageChange=event=>{
    if(event.target?.id!=='mgLanguage'&&event.target?.id!=='mgAdminLanguage')return;
    const chosen=event.target.value;if(!['gu','hi','en'].includes(chosen))return;
    window.mgSetLanguage(chosen);
  };
  document.addEventListener('change',onLanguageChange,true);
  if(!window.__mgI18nObserver&&document.body){
    window.__mgI18nObserver=new MutationObserver(records=>{
      for(const record of records){
        if(record.type==='childList')record.addedNodes.forEach(node=>{if(node.nodeType===1)scan(node);else if(node.nodeType===3)translateNode(node);});
        else if(record.type==='attributes')translateAttrs(record.target);
      }
    });
    window.__mgI18nObserver.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['placeholder','title','aria-label']});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
