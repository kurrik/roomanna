---
layout: post
title: JS1K (Minimizing method names)
tags: 
- js1k
- javascript
---
[link-knives]: http://amzn.com/1439153116
[link-js1k]: http://js1k.com/2011-dysentery/
[link-beholder]: http://marijn.haverbeke.nl/js1k.html

It's that time of year again!  The [js1k contest][link-js1k], which tests how
much functionality you can squeeze into 1024 bytes worth of JavaScript, is on.

Interestingly, this coincides with me finishing up reading a book
about one of (if not the) toughest cooking contests in the world, the 
Bocuse d'Or.  I think the book (titled [Knives at Dawn][link-knives]) inspired
me a bit - it really illustrated how a structured contest pushed these chefs
(already at the top of their game) to their limit, and helped them grow 
professionally.  I really wanted that experience for myself, especially since
I feel like I haven't had to be that creative or clever with my code in a
while.

So I decided to make an entry for this round of the contest.  I doubt I'd come
anywhere close to winning, but just getting something functional in 1k of code
is impressive enough for me.  Of course, I don't really know very much about
this kind of coding, so I'm going to try and learn some techniques, and 
post them here.  Writing about things usually helps me make better sense of 
them.

<!-- -**-END-**- -->

## Research

I wanted to get an idea of how an entry comes together.  Thankfully, Marijn 
Haverbeke, the winner of the first js1k round has 
[an awesome blog post][link-beholder] about some of the techniques he used to
create his winning entry, the entirety of which is listed here:

<pre class="blockquote">
c=document.body.children[0];h=t=150;L=w=c.width=800;u=D=50;H=[];
R=Math.random;for($ in C=c.getContext('2d'))C[$[J=X=Y=0]+($[6]||'')]=C[$];
setInterval("if(D)for(x=405,i=y=I=0;i&lt;1e4;)L=\H[i++]=i&lt;9|L&lt;w&amp;R()&lt;.3?w:R()*u+80|0;
$=++t%99-u;$=$*$/8+20;y+=Y;x+=y-H[(x+X)/u|0]>9?0:X;j=H[o=\x/u|0];
Y=y&lt;j|Y&lt;0?Y+1:(y=j,J?-10:0);with(C){A=function(c,x,y,r){r&amp;&amp;arc(x,y,r,0,7,0);
fillStyle=c.P\?c:'#'+'ceff99ff78f86eeaaffffd45333'.substr(c*3,3);f();ba()};
for(D=Z=0;Z&lt;21;Z++){Z&lt;7&amp;&amp;A(Z%6,w/\2,235,Z?250-15*Z:w);i=o-5+Z;S=x-i*u;
B=S>9&amp;S&lt;41;ta(u-S,0);G=cL(0,T=H[i],0,T+9);
T%6||(A(2,25,T-7\,5),y^j||B&amp;&amp;(H[i]-=.1,I++));
G.P=G.addColorStop;G.P(0,i%7?'#7e3':(i^o||y^T||(y=H[i]+=$/99),\'#c7a'\));
G.P(1,'#ca6');i%4&amp;&amp;A(6,t/2%200,9,i%2?27:33);m(-6,h);qt(-6,T,3,T);
l(47,T);qt(56,T,56,\h);A(G);
i%3?0:T&lt;w?(A(G,33,T-15,10),fc(31,T-7,4,9)):(A(7,25,$,9),A(G,25,$,5),fc(24,$,2,h),D=B&amp;y\
>$-9?1:D);ta(S-u,0)}A(6,u,y-9,11);A(5,M=u+X*.7,Q=y-9+Y/5,8);A(8,M,Q,5);fx(I+'c',5,15)}D=y>h?1:D"
,u);onkeydown=onkeyup=function(e){E=e.type[5]?4:0;e=e.keyCode;J=e^38?J:E;X=e^37?e^39?X:E:-E}
</pre>

Right away, something that struck me was that there were almost no method
names at all.  I can see `getContext`, `addColorStop`, and `Math.random` easily,
but where are `fill`, `beginPath`, `arc`, etc?

Had I just started coding right away, I probably would have done something
like:

<pre class="brush:javascript">
  f=c.fill;b=c.beginPath;r=c.arc;
</pre>

and so on.  So how does Marijn