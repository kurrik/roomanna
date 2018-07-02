[link-text]: http://www.gutenberg.org/files/42455/42455-0.txt

https://en.wikipedia.org/wiki/Frequency_analysis
[link-arabic]: http://ljk.imag.fr/membres/Bernard.Ycart/mel/hm/AlKadi_cryptology.pdf
https://crypto.stackexchange.com/questions/30209/developing-algorithm-for-detecting-plain-text-via-frequency-analysis 
https://en.wikipedia.org/wiki/Chi-squared_test
https://commons.wikimedia.org/wiki/File:Caesar_cipher_left_shift_of_3.svg 
https://en.wikipedia.org/wiki/Al-Kindi

One of my favorite courses in my undergraduate curriculum was an optional elective on the topic of ciphers, starting with handwritten approaches and eventually moving on into mechanical and then digital ciphers.  A few classes in the handwritten section started with the professor writing ciphertext on the board and inviting us to spend some time attempting to break it without knowledge of what the cipher actually was.

A while back I pledged to write a paper as a requirement for my Estonian fraternity.  I never actually got around to doing this, which was supposed to be on a topic unrelated to my academic major.  I had the ciphers course fresh in my head at this point, and thought it would be interesting to research more about them at some point.  So in the interest of actually making some progress along this track, I thought writing a bit about handwritten ciphers may be a good way to motivate myself to do a bit of research.  To ease into it, I'm starting with the most basic cipher I know of: the Caesar Cipher.

<!--BREAK-->

The Caesar cipher itself is a substitution cipher: to convert a piece of plaintext into ciphertext, every letter in the plaintext is consistently replaced with another letter according to some mapping.  In the Caesar cipher, the mapping is simply defined by shifting letters forward a set number of steps, wrapping around at the end of the alphabet.  I'll refer to the number of steps at the `rot` value: a mapping with `rot` of 1 means that all `A`s are replaced with 'B's, 'B's with 'C's, and 'Z's with 'A's.

I've written up a small utility to generate the mapping.  Dragging the slider below shows the mapping from plaintext letters on the top, to ciphertext letters on the bottom:
<div id="demo-alphabet"></div>

Substitution ciphers must define the alphabet they operate on.  I've decided to use the 26 letters in the English alphabet and not to convert any other characters, including whitespace and punctuation.  It's possible to fully define the working set to accommodate special characters such as numbers or other languages.   I'll use `alphabet_size` to represent this value.

To convert plaintext to ciphertext, substitute every letter in the plaintext with the mapped value for that letter.  To convert ciphertext back into plaintext, undo the mapping by applying a ciphertext of `rot` - `alphabet_size`.  This means that text encrypted with `alphabet_size = 26` and `rot = 3` can be decrypted by applying `rot = 23` (26 - 3) to the encrypted text.

Below, I've taken some [sample text][link-text] from the top box and applied the configured `rot` mapping to it to produce the Caesar Cipher-encrypted ciphertext in the bottom box.  The text in the top is editable in case you want to experiment with other input.

<div id="demo-text"></div>

While any value can be used for `rot`, there are a couple values with special properties.  A `rot` of 0 or of `alphabet_size` is an identity mapping - the plaintext and ciphertext will be identical.  For alphabets where `alphabet_size` is even, a `rot` of `alphabet_size` / 2 will act as both an encryption and decryption mapping - for this example, applying `rot = 13` to plaintext will produce ciphertext, while applying `rot = 13` to ciphertext produces plaintext.  This property makes for really nice usability, to the point where such ROT13 encoding is used on some sites as obfuscation for spoilers, and can be generated with a `rot13` command line utility which ships on many linux distributions.  In the demo above, try setting the slider to 13 and pasting the ciphertext into the box on the top - you'll see the original passage in the lower box.


<div id="test"></div>
