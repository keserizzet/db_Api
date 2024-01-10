module.exports = {
    model: libs.Mongoose.model("botModel", new libs.Mongoose.Schema({
        urunId: Number,
        urunKategori: [{type: String}],
        urunAdi: String,
        urunLink: String,
        urunDetay: String,
        urunFiyat: Number,
        urunBirim: String,
        urunYildiz: Number,
        urunBegeni: Number,
        urunAntiBegeni: Number,
        urunSevgiDegeri: Number,
        urunYorumlar:[{
            paylasanKisi: String,
            yorum: String,
            yildiz: Number,
            sevgiorani: Number, 
        },
        
    ]
    }))
}
