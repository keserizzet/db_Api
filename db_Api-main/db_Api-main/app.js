// Uygulama başlığını ayarla, sorun çıkarsa
// kapatması kolay olsun.
process.title = "wholike_backend";

// Konfigurasyon
global.config = {
    mongodb_connectionstring: "mongodb+srv://dijitalfikirtodo:123qwe123@dbcluster1.klchy1y.mongodb.net/?retryWrites=true&w=majority",
    auth_key: "12jkl123",

    debug: true,
    debug_stackdump: false
}

// Kütüphaneleri içeri aktar ve kütüphanelerin
// global olduğundan emin ol, içeri aktarılan
// dosyalar bundan faydalanabilsin.
global.libs = {
    Express: require("express"),
    Filesystem: require("fs"),
    Mongoose: require("mongoose")
}

// Modelleri global eleman içerisinde barındır.
// içeri aktarılan dosyalar bundan faydalanabilsin.
global.models = {};

// Sunucu konfigürasyonu
const Server = libs.Express();
const PORT   = 3000;

// Public varsa direkt olarak servis et.
Server.use(libs.Express.static('public'));

// Public yoksa fallback API olduğu için gelen
// istekleri JSON formatından object formatına
// geçir.
Server.use(libs.Express.json());

// Botun girmesi gereken API noktalarına Auth
// zorunluluğu getir, bu şekilde MITM ve çeşitli
// Data Spoofing/Toxication açıklarından kaçınalım.
Server.use(require("./middleware/bot_auth"));

// API olaylarını aktar.
// ---------------------
// API Olaylarının dosya sistemi üzerinden aktarılması,
// koda dinamiklik katar ve bu dinamiklik sonucunda 
// diğer yazılımcı arkadaşların API kodlaması daha
// da kolaylaşacaktır, aktarımlar tek bir standardı
// paylaşacaktır ve her API yı içeri aktarırken
// israf kodlardan kurtulmuş olacağız.
libs.Filesystem.readdirSync("./api/").forEach(folder => {
    // Her klasörü oku ve içindeki js dosyalarını içeri aktar.
    libs.Filesystem.readdirSync(`./api/${folder}/`).forEach(file => {
        let _MODULE = require(`./api/${folder}/${file}`);
        _MODULE.category = folder;
        Server[_MODULE.method.toLowerCase()](_MODULE.route, _MODULE.action);
    });
});

// Express için hata sürücüsü ayarla.
// Bu şekilde API yı kullanan taraf, hatayı JSON
// formatında alacaktır.
Server.use((err, req, res, next) => {
    let statusCode = err.status || 500;
    res.status(statusCode);
    if (global.config.debug) res.send(JSON.stringify({
        statusCode,
        error: err.message,
        stack: (global.config.debug_stackdump ? err.stack : null)
    }));
    else res.send(JSON.stringify({
        statusCode,
        error: "An error occurred in the server. Please contact server administrators for further details."
    }));
});


// Mongoose sunucusuna bağlan ve API arabirimini
// aktif et. Mongoose'un rahat kullanımı için
// global de mongoose kütüphanesini referansla.
global.mgoose = global.libs.Mongoose;

console.log("Mongoose ile sunucuya bağlantı hazırlanıyor...");
mgoose.connect(config.mongodb_connectionstring).then(() => {
    console.log("Mongoose ile sunucuya bağlantı sağlandı!");
    console.log("Modeller içeri aktarılıyor...");
    libs.Filesystem.readdirSync("./model/").forEach(file => {
        let _MODEL = require(`./model/${file}`);
        global.models[_MODEL.model.modelName] = _MODEL.model;
    });
    console.log("Modeller aktarıldı.");
    console.log("API Sunucusu aktif hale getiriliyor...");
    Server.listen(PORT, () => console.log(`Sunucu servis modunda aktiftir! Port ${PORT}`)).on("error", reason => {
        // Hata varsa, hatanın ne olduğuna bakalım.
        console.error(
            `
                Express sunucusu bağlantı esnasında çöktü :(
                    Hata sebepleri şunlar olabilir:
                    - API'da runtime hataları bulunuyor olabilir.
                    - API'da middleware'lar hatalı çalışıyor olabilir.
                Hata sebebi aşağıdaki dökümanda yer alıyor:
                -----------------------------------------------------------------------
                HATA SEBEBİ: ${reason.name}
                HATA BİLGİSİ: ${reason.message}
                ----------------------------HATA STACK----------------------------
                ${reason.stack}
            `
        );
    });
}).catch(reason => {
    // Hata varsa, hatanın ne olduğuna bakalım.
    console.error(
        `
            Mongoose sunucusu bağlantı esnasında çöktü :(
                Hata sebepleri şunlar olabilir:
                - ConnectionString yanlış girilmiş olabilir
                - MongoDB Atlas, IP Adresinizi Whitelist te barındırmıyor olabilir.
                - MongoDB Atlas sunucunuz devre dışı olabilir.
                - Modellerinizde sıkıntı bulunuyor olabilir.
                - Express sunucunuzda hata bulunuyor olabilir.
            Hata sebebi aşağıdaki dökümanda yer alıyor:
            -----------------------------------------------------------------------
            HATA SEBEBİ: ${reason.name}
            HATA BİLGİSİ: ${reason.message}
            ----------------------------HATA STACK----------------------------
            ${reason.stack}
        `
    );
});
