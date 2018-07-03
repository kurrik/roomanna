[link-text]: http://www.gutenberg.org/files/42455/42455-0.txt 
[link-suetonius]: http://www.gutenberg.org/files/6400/6400-h/6400-h.htm
[link-arabic]: http://ljk.imag.fr/membres/Bernard.Ycart/mel/hm/AlKadi_cryptology.pdf

https://en.wikipedia.org/wiki/Frequency_analysis

https://crypto.stackexchange.com/questions/30209/developing-algorithm-for-detecting-plain-text-via-frequency-analysis 
https://en.wikipedia.org/wiki/Chi-squared_test
https://commons.wikimedia.org/wiki/File:Caesar_cipher_left_shift_of_3.svg 
https://en.wikipedia.org/wiki/Al-Kindi
http://www.citationmachine.net/bibliographies/332305172 

One of my favorite courses in my undergraduate curriculum was an optional elective on the topic of ciphers, starting with handwritten approaches and eventually moving on into mechanical and then digital ciphers.  A few classes in the handwritten section started with the professor writing ciphertext on the board and inviting us to spend some time attempting to break it without knowledge of what the cipher actually was.

A while back I pledged to write a paper as a requirement for my Estonian fraternity.  I never actually got around to doing this, which was supposed to be on a topic unrelated to my academic major.  I had the ciphers course fresh in my head at this point, and thought it would be interesting to research more about them at some point.  So in the interest of actually making some progress along this track, I thought writing a bit about handwritten ciphers may be a good way to motivate myself to do a bit of research.  To ease into it, I'm starting with the most basic cipher I know of: the Caesar Cipher.

<!--BREAK-->

The Caesar cipher itself is a substitution cipher: to convert a piece of plaintext into ciphertext, every letter in the plaintext is consistently replaced with another letter according to some mapping.  In the Caesar cipher, the mapping is simply defined by shifting letters forward a set number of steps, wrapping around at the end of the alphabet.  I'll refer to the number of steps at the `ROT` value: a mapping of `ROT1` means that all `A`s are replaced with 'B's, 'B's with 'C's, and 'Z's with 'A's.  `ROT20` shifts the letters by 20, etc.

I've written up a small utility to generate the mapping.  Dragging the slider below shows the mapping from plaintext letters on the top, to ciphertext letters on the bottom:
<div id="demo-alphabet"></div>

Substitution ciphers must define the alphabet they operate on.  I've decided to use the 26 letters in the English alphabet and not to convert any other characters, including whitespace and punctuation.  It's possible to fully define the working set to accommodate special characters such as numbers or other languages.   I'll use `ALPHA` to represent the size of the working alphabet, with `ALPHA26` representing the 26 English characters.

To convert plaintext to ciphertext, substitute every letter in the plaintext with the mapped value for that letter.  To convert ciphertext back into plaintext, undo the mapping by applying a ciphertext of `ROT` - `ALPHA`.  This means that text encrypted with  `ALPHA26` and `ROT3` can be decrypted by applying `ROT23` (26 - 3) to the encrypted text.

Below, I've taken some [sample text][link-text] from the top box and applied the configured `ROT` mapping to it to produce the Caesar Cipher-encrypted ciphertext in the bottom box.  The text in the top is editable in case you want to experiment with other input.

<div id="demo-text"></div>

While any value can be used for `ROT`, there are a couple values with special properties.  A `ROT` of 0 or of `ALPHA` is an identity mapping - the plaintext and ciphertext will be identical.  For alphabets where the length of the alphabet is even, a `ROT` of `ALPHA` / 2 will act as both an encryption and decryption mapping - for this example, applying `ROT13` to plaintext will produce ciphertext, while applying `ROT13` to ciphertext produces plaintext.  This property makes for really nice usability, to the point where such encoding is used on some sites as obfuscation for spoilers, and can be generated with a `rot13` command line utility which ships on linux distributions.  In the demo above, try setting the slider to 13 and pasting the ciphertext into the box on the top - you'll see the original passage in the lower box.

The cipher itself is named after Julius Caesar, who reportedly used a form of `ROT3` in his sensitive letters:

<blockquote class="blockquote">
  <p class="mb-0">There are extant likewise some letters from him to Cicero, and others to his friends, concerning his domestic affairs; in which, if there was occasion for secrecy, he wrote in cyphers; that is, he used the alphabet in such a manner, that not a single word could be made out. The way to decipher those epistles was to substitute the fourth for the first letter, as d for a, and so for the other letters respectively.</p>
  <footer class="blockquote-footer"><cite title="Source Title">(Suetonius & Thomson)</cite></footer>
</blockquote>

<blockquote class="blockquote">
  <p class="mb-0">The Arabic foundation of algebra is widely acknowledged, but this is hardly the case with statistics.  Historians of mathematics attribute the first writings on probability and statistics to correspondence between Pascal and Fermat in 1654.  In his recently discovered manuscript, al-Kindī gave the first description of statistical methods in cryptanalysis.  He even explicitly required texts to be long enough to allow letter statistics to be meaningful.  This is the world's first known writings in statistics, antedating those of Pascal and Fermat by about 800 years.</p>
  <footer class="blockquote-footer"><cite>(Al-Kadit, 1992, p. 101)</cite></footer>
</blockquote>

<blockquote class="blockquote">
  <p class="mb-0">the most important and original of al-Kindī's contributions comprises the world's first description and use of statistical techniques in cryptanalysis (or in any other application, for that matter). In his discussion of the quantitative techniques in cryptanalysis, al-Kindī clearly described how to use letter frequency statistics of the cryptogram to solve it.  He also explained how to find these letter frequencies (by using a sample of the same language).</p>
  <footer class="blockquote-footer"><cite>(Al-Kadit, 1992, pp. 107-108)</cite></footer>
</blockquote>

al-Kindī's approach was:

<blockquote class="blockquote">
  <p class="mb-0">One way to solve an encrypted message, if we know its [original] language, is to find a [different clear] text of the same language long enough to fill one sheet or so and then we count [the occurrences of] each letter of it.  We call the most frequently occurring letter the "first", the next most occurring the "second", the following most occurring the "third" and so on, until we finish all different letters in the cleartext [sample].  Then we look at the cryptogram we want to solve and we also classify its symbols.  We find the most occurring symbol and change it to the form of the "first" letter [of the cleartext sample], the next most common symbol is changed to the form of the "second" letter, and the following most common symbol is changed to the form of the "third" letter and so on, until we account for all symbols of the cryptogram we want to solve.</p>
  <p class="mb-0">It could happen sometimes that the cryptogram is too short to have all different letters.  The high and low [frequency] counts will not be correct, for high and low counts are only correct in long enough messages to correspond to all places of frequent and rare occurrences so that if some letters are [too] few in one segment of the message, they will be [too] many in others.  But if the cryptogram is too short, equivalence does not apply, letter ranks are not correct and [consequently] a second trick should be used to recover letters.  Such a trick is qualitative which is ... [here al-Kindī' wrote in detail on possible letter combinations in a language like 'al' in Arabic... etc.]</p>
  <footer class="blockquote-footer"><cite>(Al-Kadit, 1992, pp. 107-108)</cite></footer>
</blockquote>



Al-Kadit, I. A. (1992). Origins Of Cryptology: The Arab Contributions. _Cryptologia,16_ (2), 97-126. doi:10.1080#8203;/0161-119291866801. Retrieved from <http://ljk.imag.fr/membres/Bernard.Ycart/mel/hm/AlKadi_cryptology.pdf>

Suetonius. (n.d.). _The lives of the twelve Caesars: To which are added, his lives of the grammarians, rhetoricians, and poets_ (A. Thomson, Trans.). Retrieved from <http://www.gutenberg.org/files/6400/6400-h/6400-h.htm>
