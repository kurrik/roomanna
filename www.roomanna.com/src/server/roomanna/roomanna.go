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

package roomanna

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"time"
)

type Handler struct {
	Path         string
	LastModified string
	Templates    *template.Template
	Prod         bool
}

// Handles all HTTP requests.
func (h *Handler) HandleRequest(w http.ResponseWriter, r *http.Request) {
	var (
		tmpl *template.Template
		templateName string = "content"
	)
	log.Printf("[roomanna] Served path: %q", r.URL.Path)
	if tmpl = h.Templates.Lookup(templateName); tmpl == nil {
		log.Printf("[roomanna] Template with name: '%v' not found", templateName)
		http.NotFound(w, r)
		return
	}
	var (
		maxage   = 3600
		expires  = time.Now().Add(time.Second * time.Duration(maxage))
		ccontrol = fmt.Sprintf("max-age=%v, public", maxage)
		data     = map[string]interface{}{
			"StaticPrefix": "/static",
		}
	)
	w.Header().Set("Last-Modified", h.LastModified)
	w.Header().Set("Cache-Control", ccontrol)
	w.Header().Set("Expires", expires.Format(time.RFC1123))
	w.Header().Del("Set-Cookie")
	tmpl.Execute(w, data)
}

// Wraps http requests in a closure so request handlers can access state.
func GetHandler(h *Handler) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		h.HandleRequest(w, r)
	}
}

// Serve over HTTP.
func init() {
	var (
		err      error
		modified []byte
		tmpl     *template.Template
		devel    bool
	)
	modified = []byte(time.Now().Format(time.RFC1123))
	if tmpl, err = template.ParseGlob("www.roomanna.com/src/server/content/*.html"); err != nil {
		panic(err)
	}
	devel = os.Getenv("DEVEL") == "1"
	log.Printf("[roomanna] Starting up with PROD=%v", !devel)
	handler := &Handler{
		Path:         "www.roomanna.com/src/server/content",
		LastModified: string(modified),
		Templates:    tmpl,
		Prod:         !devel,
	}
	http.HandleFunc("/", GetHandler(handler))
}
