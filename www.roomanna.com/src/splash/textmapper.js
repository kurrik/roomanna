// Copyright 2017 Arne Roomann-Kurrik
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

export default function TextMapper(w, h) {
  this.canvas = document.createElement('canvas');
  this.canvas.width = w;
  this.canvas.height = h;
  this.context = this.canvas.getContext('2d');
};

TextMapper.prototype.drawText = function(text) {
  var fontSize = 20;
  var fontName = "LeagueGothic";
  this.context.font = fontSize + 'px ' + fontName;
  var ratio = this.canvas.width / this.context.measureText(text).width;
  this.context.font = Math.round(fontSize * ratio) + 'px ' + fontName;
  this.context.fillStyle = '#000000';
  this.context.fillText(text, 0, this.canvas.height);
};
