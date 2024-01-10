/*
    Poyraz:
    Bu middleware aracı, Bot ile backend'in bot kısmı
    arasında authentication sağlayacaktır. MITM Tekniği
    ile dışarıdan veri aktarmaya (Data spoofing, Data
    Toxication) engel olacaktır.
*/

module.exports = function(req, res, next) {
    // Route'u kontrol et ve eğer route da
    // bota açık verilecek alan varsa auth'u
    // zorunlu kıl.
    if (!req.originalUrl.startsWith("/api/bot")) return next();
    
    // Doğrulama gerektiren alana giriş eylemi
    // gerçekleştiği için ekstra olarak requester'in
    // IP adresini ekrana yazdır.
    console.log("Auth gerektiren eylem '" + req.originalUrl + "' alanında istendi. İstemci IP-PORT: " + (req.socket.remoteAddress + (Boolean(req.headers['x-forwarded-for']) ? " Proxy Forwarding:" + req.headers['x-forwarded-for'] : "")));
    if (req.body.auth_id !== global.config.auth_key)
        return next((err = new Error("You are unauthenticated"), err.status = 401, err));
    else
        return next();
}
