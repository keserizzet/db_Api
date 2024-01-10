module.exports = {
    name: "Delete Bot Model",
    route: "/api/bot/models/delete",
    method: "POST",
    action(request, response){
        // Post ile ID gönderildi.
        response.send(models.botModel.find({ id:request.body.id }).remove().exec());
    }
}