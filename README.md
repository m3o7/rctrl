rctrl
=====

raspberry controll center

### setup
####requirements:
```bash
sudo easy_install flask gunicorn
sudo pip install flickrapi
```
The python flickrapi seems to have been discontinued, so I have forked the git it [here](https://github.com/marcopashkov/flickrapi.git).

#### credentials:
fill in your ```api key```, ```api secret``` and ```api token```. Here you can find your [api key](http://www.flickr.com/services/api/keys/)
and [api secret](http://www.flickr.com/services/api/keys/). 
```bash
echo "api_key = '<api key>'" > flickr_credentials.py
echo "api_secret = '<api secret>'" >> flickr_credentials.py
echo "token = '<api-token>'" >> flickr_credentials.py
```

### run server
for debugging
```bash
python server.py
```

for **production** - fill in your ```ip address```
```bash
gunicorn server:app --bind <ip address>:80 --workers 2 --timeout 60
```
