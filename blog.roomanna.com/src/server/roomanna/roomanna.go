// Copyright 2012 Arne Roomann-Kurrik
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

package roomanna

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

type Handler struct {
	Path         string
	LastModified string
}

// Handles all HTTP requests.
func (h *Handler) HandleRequest(w http.ResponseWriter, r *http.Request) {
	var (
		err  error
		path string
		info os.FileInfo
	)
	log.Printf("[roomanna] Served path: %q", r.URL.Path)
	path = filepath.Join(h.Path, r.URL.Path)
	if info, err = os.Stat(path); err != nil {
		http.NotFound(w, r)
		return
	}
	if info.IsDir() {
		path = filepath.Join(path, "index.html")
		if info, err = os.Stat(path); err != nil {
			http.NotFound(w, r)
			return
		}
	}
	var (
		maxage   = 3600
		expires  = time.Now().Add(time.Second * time.Duration(maxage))
		ccontrol = fmt.Sprintf("max-age=%v, public", maxage)
		mode     = os.Getenv("ROOMANNA_MODE")
	)
	w.Header().Set("Last-Modified", h.LastModified)
	w.Header().Set("Cache-Control", ccontrol)
	w.Header().Set("Expires", expires.Format(time.RFC1123))

	if mode != "dev" {
		w.Header().Set("Strict-Transport-Security", "max-age=86400; includeSubDomains")
	}
	w.Header().Del("Set-Cookie")
	http.ServeFile(w, r, path)
}

// Wraps http requests in a closure so request handlers can access state.
func GetHandler(h *Handler) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		h.HandleRequest(w, r)
	}
}

// Serve the given GhostWriter config over HTTP.
func init() {
	var (
		err      error
		modified []byte
	)
	if modified, err = ioutil.ReadFile("blog.roomanna.com/build/content/rendered.txt"); err != nil {
		modified = []byte(time.Now().Format(time.RFC1123))
	}
	handler := &Handler{
		Path:         "blog.roomanna.com/build/content",
		LastModified: string(modified),
	}
	http.HandleFunc("/", GetHandler(handler))
}
