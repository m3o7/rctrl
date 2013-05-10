from flask import Flask, render_template
import flickrapi
import flickr_credentials as fc
import md5
app = Flask(__name__)

def get_flickr_api():
    """return authenticated flickr api"""
    flickr = flickrapi.FlickrAPI(fc.api_key, fc.api_secret, token=fc.token)
    return flickr

@app.route("/flickr")
def flickr_uploadr():
    """render a flickr javascript upload page"""

    ### get the flickr api
    flickr = get_flickr_api()

    ### build a flickr upload signature for javascript uploads
    tags = "raspberry_pi_upload"
    m = md5.new()
    m.update(fc.api_secret + "api_key" + fc.api_key  + "auth_token" + fc.token + "submitUpload" + "tags" + tags)
    api_sig = m.hexdigest()

    ### template tokens
    values = {
        "api_key" : fc.api_key,
        "token" : fc.token,
        "api_sig" : api_sig,
        "tags" : tags,
    }

    return render_template('flickr.html', **values)

if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0')
