(function () {
    var input = document.getElementById("images"), 
        formdata = false;

    var successful_upload = 0;
    var successful_loaded = 0;
    var max_files = 500;             // max amount of files that can be uploaded
    var start_time = null;
    var current_time = null;
    var last_time_diff = 0;
    var refreshIntervalId = null;

    function activeTimer() {
        start_time = Math.round(new Date().getTime()/1000.0);
        refreshIntervalId = setInterval(updateTimer, 1000);
    }

    function updateTimer( )
    {   
        current_time = Math.round(new Date().getTime()/1000.0);
        $("#timer").html("time : " + (current_time - start_time) + "s");
    }

    function showUploadedItem (file_name) {
        var list = document.getElementById("image-list"),
            li   = document.createElement("li"),
            // img  = document.createElement("img");
            div = document.createElement("div");
            div.innerHTML = file_name;
            var temp = file_name.replace(".", "_");
            div.id = temp;
            div.className += "grey";
        // img.src = source;
        li.appendChild(div);
        list.appendChild(li);
    }

    function show_currently_uploading(file){
        if ( window.FileReader ) {
            reader = new FileReader();
            reader.onloadend = function (e) { 
                // passcurrent_picture
                var div = document.getElementById("current_picture");
                div.innerHTML = "";
                img  = document.createElement("img");
                img.src = e.target.result;
                img.id = "current_upload";
                div.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    }

    function upload_picture (files, current, total) {
        file = files[current]
        file_name = file.name

        if (!!file.type.match(/image.*/)) {
            // notify of uploading
            $("#" + file_name.replace(".", "_")).removeClass("grey");
            $("#" + file_name.replace(".", "_")).addClass("upload");
            show_currently_uploading(file);

        } else {
            // skip
            $("#" + file_name.replace(".", "_")).removeClass("grey");
            $("#" + file_name.replace(".", "_")).addClass("error");
            successful_upload++;
            if (successful_upload < total){
                upload_picture(files, current + 1, total);
            } else {
                $("#finish").html("Finished! (uploaded: " + successful_upload + " photos)");
                $("#response").html("");
                clearInterval(refreshIntervalId);
            }
            return
        }

        formdata = new FormData();
        formdata.append("photo", file);
        formdata.append("api_key", $("#001").val());
        formdata.append("auth_token", $("#002").val());
        formdata.append("api_sig", $("#003").val());
        formdata.append("tags", $("#004").val());
        formdata.append("submit", "Upload");

        if (formdata) {
            $.ajax({
                url: "http://api.flickr.com/services/upload/",
                type: "post",
                data: formdata,
                processData: false,
                contentType: false,
                error: function (response) {
                    alert("Could not upload photo: " + file_name);
                    successful_upload++;
                    upload_picture(files, current + 1, total);
                },
                success: function (response) {
                    // notify user of successful upload
                    successful_upload = successful_upload + 1;
                    $("#" + file_name.replace(".", "_")).removeClass("upload");
                    $("#" + file_name.replace(".", "_")).addClass("finish");
                    $("#" + file_name.replace(".", "_")).append(" " + (current_time - start_time - last_time_diff) + "s");
                    last_time_diff = (current_time - start_time);
                    if (total > successful_upload) {
                        $("#response").html("Uploaded " + successful_upload + " of " + total);
                        upload_picture(files, current + 1, total);
                    }else {
                        $("#finish").html("Finished! (uploaded: " + successful_upload + " photos)");
                        $("#response").html("");
                        clearInterval(refreshIntervalId);
                    }
                }
            });
        }
    }

    if (window.FormData) {
        formdata = new FormData();
        // document.getElementById("btn").style.display = "none";
    }
    
    input.addEventListener("change", function (evt) {
        activeTimer();
        document.getElementById("response").innerHTML = "Uploading..."
        var i = 0, len = this.files.length, img, reader, file;
        
        if (len > max_files){
            var message = "You can only upload up to " + max_files + " photos at once."
            $("#response").html("");
            $("#error").html(message);
            return
        }else {
            $("#error").html("");
        }

        document.getElementById("response").innerHTML = "Uploaded " + i + " of " + len;
        for ( ; i < len; i++ ) {
            showUploadedItem(this.files[i].name);
        }

        upload_picture(this.files, 0, len);

    }, false);
}());
