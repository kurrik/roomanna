This is the post snippet.

<!--BREAK-->

{{define "gallerydata"}}
master:
  - Image: {{imagemeta "images/2017-01-01.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-01.jpg" | tojson}}
    Description: 1/1/2017
  - Image: {{imagemeta "images/2017-01-02.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-02.jpg" | tojson}}
    Description: 1/2/2017
  - Image: {{imagemeta "images/2017-01-03.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-03.jpg" | tojson}}
    Description: 1/3/2017
  - Image: {{imagemeta "images/2017-01-04.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-04.jpg" | tojson}}
    Description: 1/4/2017
  - Image: {{imagemeta "images/2017-01-05.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-05.jpg" | tojson}}
    Description: 1/5/2017
  - Image: {{imagemeta "images/2017-01-06.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-06.jpg" | tojson}}
    Description: 1/6/2017
  - Image: {{imagemeta "images/2017-01-07.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-07.jpg" | tojson}}
    Description: 1/7/2017
  - Image: {{imagemeta "images/2017-01-09.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-09.jpg" | tojson}}
    Description: 1/9/2017
  - Image: {{imagemeta "images/2017-01-10.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-10.jpg" | tojson}}
    Description: 1/10/2017
  - Image: {{imagemeta "images/2017-01-14.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-14.jpg" | tojson}}
    Description: 1/14/2017
  - Image: {{imagemeta "images/2017-01-16.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-16.jpg" | tojson}}
    Description: 1/16/2017
  - Image: {{imagemeta "images/2017-01-19.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-19.jpg" | tojson}}
    Description: 1/19/2017
  - Image: {{imagemeta "images/2017-01-24.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-24.jpg" | tojson}}
    Description: 1/24/2017
  - Image: {{imagemeta "images/2017-01-25.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-25.jpg" | tojson}}
    Description: 1/25/2017
imagination:
  - Image: {{imagemeta "images/2017-01-08.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-08.jpg" | tojson}}
    Description: 1/8/2017
  - Image: {{imagemeta "images/2017-01-11.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-11.jpg" | tojson}}
    Description: 1/11/2017
  - Image: {{imagemeta "images/2017-01-12.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-12.jpg" | tojson}}
    Description: 1/12/2017
  - Image: {{imagemeta "images/2017-01-13.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-13.jpg" | tojson}}
    Description: 1/13/2017
  - Image: {{imagemeta "images/2017-01-15.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-15.jpg" | tojson}}
    Description: 1/15/2017
  - Image: {{imagemeta "images/2017-01-23.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-23.jpg" | tojson}}
    Description: 1/23/2017
  - Image: {{imagemeta "images/2017-01-26.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-26.jpg" | tojson}}
    Description: 1/26/2017
still:
  - Image: {{imagemeta "images/2017-01-17.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-17.jpg" | tojson}}
    Description: 1/17/2017
  - Image: {{imagemeta "images/2017-01-18.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-18.jpg" | tojson}}
    Description: 1/18/2017
  - Image: {{imagemeta "images/2017-01-20.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-20.jpg" | tojson}}
    Description: 1/20/2017
  - Image: {{imagemeta "images/2017-01-21.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-21.jpg" | tojson}}
    Description: 1/21/2017
  - Image: {{imagemeta "images/2017-01-22.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-22.jpg" | tojson}}
    Description: 1/22/2017
portrait:
  - Image: {{imagemeta "images/2017-01-27.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-27.jpg" | tojson}}
    Description: 1/27/2017
  - Image: {{imagemeta "images/2017-01-28.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-28.jpg" | tojson}}
    Description: 1/28/2017
  - Image: {{imagemeta "images/2017-01-29.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-29.jpg" | tojson}}
    Description: 1/29/2017
  - Image: {{imagemeta "images/2017-01-30.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-30.jpg" | tojson}}
    Description: 1/30/2017
  - Image: {{imagemeta "images/2017-01-31.jpg" | tojson}}
    Thumb: {{imagemeta "thumbs/2017-01-31.jpg" | tojson}}
    Description: 1/31/2017
{{end}}

# Master studies

{{template "gallery" (yamltemplate "gallerydata").master}}

- 1/1/2017 <a href='https://www.google.com/culturalinstitute/beta/u/0/asset/st-peter-penitent/PQHwLQK-rnIW_Q' target='_blank'>St.Peter Penitent - Gerrit van Honthorst</a>
- 1/2/2017 <a href='https://www.google.com/culturalinstitute/beta/u/0/asset/still-life-with-golden-bream/_wF25zyWxL0HNg' target='_blank'>Still Life with Golden Bream - Francisco de Goya</a>
- 1/3/2017 <a href='https://www.google.com/culturalinstitute/beta/asset/he-can-no-longer-at-the-age-of-ninety-eight/kgEEv3oMtfYbEA' target='_blank'>He Can No Longer at the Age of Ninety-Eight - Francisco de Goya</a>
- 1/4/2017 <a href='https://www.google.com/culturalinstitute/beta/asset/the-wave/-gEaE1qjRL-dDA' target='_blank'>The Wave - Gustave Courbet</a>
- 1/5/2017 <a href='https://www.google.com/culturalinstitute/beta/asset/self-portrait/dAHoypIzxT84Ug' target='_blank'>Self-portrait - Joseph Wright of Derby</a>
- 1/6/2017 <a href='https://www.google.com/culturalinstitute/beta/asset/lady-in-black-with-spanish-scarf-o-in-black-with-a-scarf/7QEUFBZ-RQfDiw' target='_blank'>Lady in Black with Spanish Scarf - Robert Henri</a>
- 1/7/2017 <a href='https://www.google.com/culturalinstitute/beta/asset/talcott-williams/nAFSnZZc-oRYeg' target='_blank'>Talcott Williams - Thomas Cowperthwaite Eakins</a>
- 1/9/2017 <a href='https://www.google.com/culturalinstitute/beta/asset/the-golden-hour/rQEMba9jB6XNzA' target='_blank'>The Golden Hour - Thomas Moran</a>
- 1/10/2017 <a href='https://www.wikiart.org/en/albert-bierstadt/among-the-bernese-alps' target='_blank'>Albert Bierstadt - Among the Bernese Alps</a>
- 1/14/2017 <a href='https://www.google.com/culturalinstitute/beta/asset/louise-antoinette-feuardent/gQGmaRXk5yi1OQ' target='_blank'>Louise-Antoinette Feuardent - Jean-François Millet</a>
- 1/16/2017 <a href='https://www.google.com/culturalinstitute/beta/asset/still-life-with-tin-pitcher-and-peaches/owEaRtu7bNxUng' target='_blank'>Still Life with Tin Pitcher and Peaches - Jean-Baptiste-Siméon Chardin</a>
- 1/19/2017 <a href='https://www.google.com/culturalinstitute/beta/asset/a-bowl-of-plums/pwFFzDucn1HAQA' target='_blank'>A Bowl of Plums - Jean-Baptiste Simeon Chardin</a>
- 1/24/2017 <a href='https://www.wikiart.org/en/anthony-van-dyck/portrait-of-cornelis-van-der-geest' target='_blank'>Cornelis van der Geest - Anthony van Dyck</a>
- 1/25/2017 <a href='https://www.wikiart.org/en/thomas-couture/etude-de-jeune-fille' target='_blank'>Etude de Jeune Fille - Thomas Couture</a>

# Imagination

{{template "gallery" (yamltemplate "gallerydata").imagination}}

# Still life

{{template "gallery" (yamltemplate "gallerydata").still}}

# Self portrait

{{template "gallery" (yamltemplate "gallerydata").portrait}}

{{template "gallery-lightbox"}}
