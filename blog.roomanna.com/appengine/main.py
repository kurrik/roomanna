# Copyright 2010 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
 
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
import os
import logging
import datetime

CONTENT_TYPES = {
  'html' : 'text/html',
  'css' : 'text/css',
  'jpg' : 'image/jpeg',
  'png' : 'image/png',
  'ttf' : 'font/ttf',
  'otf' : 'font/otf',
}
class MainHandler(webapp.RequestHandler):
  def head(self):
    self.get()
    self.response.clear()

  def get(self):
    path = os.path.join(os.path.dirname(__file__), '_site', self.request.path[1:])
    logging.info('Path requested: %s' % path)
    if os.path.isdir(path):
      logging.info('Trying to get directory: %s' % path)
      path = os.path.join(path, 'index.html')
    if os.path.isfile(path):
      logging.info('Trying to get file: %s' % path)
      file_handle = open(path, 'r')
      file_contents = file_handle.read()
      file_handle.close()
      file_ext = path.split('.')[-1]
      if CONTENT_TYPES.has_key(file_ext):
        self.response.headers["Content-Type"] = CONTENT_TYPES[file_ext]
      if file_ext not in ["html", "xml"]:
        expires = datetime.datetime.today() + datetime.timedelta(days=30)
        expires_str = expires.strftime('%a, %d %b %Y 00:00:00 GMT')
        self.response.headers["Expires"] = expires_str
        self.response.headers["Cache-Control"] = "public, max-age=2592000"
      self.response.out.write(file_contents)

def main():  # pragma: no cover
  application = webapp.WSGIApplication([
    ('/.*', MainHandler),
  ], debug=False)
  util.run_wsgi_app(application)

if __name__ == '__main__':  # pragma: no cover
  main()
