function addTextWidthPorts(elmApp) {

    elmApp.ports.textWidthRequest.subscribe(function (id) {
        var text = document.getElementById(id);
        var viewport = document.getElementById('viewport');

        var textWidth = text && text.getBoundingClientRect().width;
        var viewportWidth = viewport && viewport.getBoundingClientRect().width;

        if (textWidth && viewportWidth) {
          elmApp.ports.textWidthResponse.send([id, textWidth / viewportWidth ]);
        }
    });
}
