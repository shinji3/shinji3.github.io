var onLoaded = function (sender, args) {
    var slPlugin = sender.getHost();
    var grid = slPlugin.content.FindName("grid");
    var mediaElement = slPlugin.content.FindName("mediaElement");
    var url = swfobject.getQueryParamValue("url");

    if (!url) {
        slPlugin.style.display = "none";
        document.getElementById("form").style.display = "block";
        return;
    }

    url = decodeURIComponent(decodeURIComponent(url));
    var ip_and_port = url.split("/")[2];
    if (ip_and_port.split(":")[0] === "localhost") {
        ip_and_port = ip_and_port.replace("localhost", "127.0.0.1");
    }
    var is_peca = url.split("/")[3] === "pls";
    if (is_peca) {
        var id_and_tip = url.split("/")[4];
        var title = id_and_tip.split("?")[0];
        mediaElement.Source = "mms://" + ip_and_port + "/stream/" + id_and_tip;
    } else {
        var title = ip_and_port;
        mediaElement.Source = "mms://" + ip_and_port + "/?stream-switch";
    }

    var title_change = function () {
        document.title = Math.round(mediaElement.Volume * 100) + " " + mediaElement.CurrentState + " " + title;
    };

    mediaElement.addEventListener("CurrentStateChanged", function (sender, args) {
        title_change();
    });

    grid.addEventListener("KeyDown", function (sender, args) {
        switch (args.Key) {
            case 3:
                if (mediaElement.CurrentState === "Playing") {
                    mediaElement.Stop();
                } else {
                    mediaElement.Play();
                }
                break;
            case 8:
                slPlugin.content.fullScreen = !slPlugin.content.fullScreen;
                break;
            case 15:
                mediaElement.Volume += args.Shift ? 0.01 : 0.05;
                title_change();
                break;
            case 17:
                mediaElement.Volume -= args.Shift ? 0.01 : 0.05;
                title_change();
                break;
        }
    });

    grid.addEventListener("MouseWheel", function (sender, args) {
        if (!slPlugin.content.fullScreen) return;
        if (args.Delta > 0) {
            mediaElement.Volume += 0.05;
        } else if (args.Delta < 0) {
            mediaElement.Volume -= 0.05;
        }
        title_change();
    });

    $(document).mousewheel(function(event) {
        if (event.deltaY > 0) {
            mediaElement.Volume += 0.05;
        } else if (event.deltaY < 0) {
            mediaElement.Volume -= 0.05;
        }
        title_change();
    });
};
