const { model } = require("mongoose")

module.exports = {
    name: "Push Bot Model",
    route: "/api/bot/models/push",
    method: "POST",
    action(request, response){
        // Veriyi İşliceksin

        // Veriyi veritabanına aktarıcaksın.

        // Eğer veritabanında aynı ID ile veri
        // Bulunuyorsa üstüne yazıcaksın.

        // Gelen datanın formatı şu:
        const örnekData = {
            data: [
                /* Bot Şeması ile aynı */
                {urunId :1},
                {urunId :2}
            ]
        }

        request.body.data.forEach(data => {
            let xmodel = model.find({urunId: data.urunId});
            if(xmodel) {
                // update
            } else {
                // yeni veri oluştur
            }
        })
    }
}