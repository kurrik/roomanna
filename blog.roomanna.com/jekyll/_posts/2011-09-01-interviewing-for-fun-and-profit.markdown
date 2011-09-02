---
layout: post
title: Interviewing For Fun And Profit
tags:
- interviewing
---
[1]: http://www.aaronboodman.com/2010/10/wherein-i-help-you-get-good-job.html
[2]: /img/2011-09-01/interview.jpg
[3]: http://www.flickr.com/photos/danieltedcfeliciano/5348850648/

During my 4 years at Google, I conducted over 70 interviews.  While there
were definite hiring droughts, there were several months where I would have
2-4 interviews a week.  Since most interviews are just 45 minutes, an
interviewer has to get a good idea of a person's abilities in a short
time span.  Usually this means that one major mistake can make the
difference between a candidate getting a passing score or a failing score.
I've certainly had interviews start off really promising, but go quickly
downhill when the candidate made a few key errors.

[!['...'][2]][3]

I finally found myself on the receiving end of a few technical interviews
when applying for the position at Twitter, so my mind was on strategies
which would help me out.  I tried to identify areas where I had failed
people in the past.  So in the interest of helping otherwise qualified
candidates from making silly mistakes, here are some suggestions for
people looking for a software engineering job:

<!-- -**-END-**- -->

* **Don’t give up easily**<br>
  I think one of the most basic things you can do to fail an interview
is to assume that there’s no answer to a given question.  If I ask a
developer how to reverse a hash of an IP address and they tell me that
hashes can’t be reversed, then I'm going to think that the candidate
gives up too easily.  If you find yourself coming up against the limits
of what is possible, start breaking physical laws.  Pretend you have
infinite resources, since companies like Google usually do.  

* **Distill all programming questions into CS algorithms**<br>
  Know how to implement a fast sort by hand.  Know implementation details
for hash maps, linked lists, heaps.  Understand how to guesstimate the
order runtime for an algorithm.  If stumped, go for brute force and
explain ways you’d consider trying to optimize things.  Know the names
of a few algorithms like the Fisher-Yates shuffle.  There’s no interview
question which a solid application of CS fundamentals won’t solve or at
least make you look good.

* **Don’t lie or exaggerate on your resume**<br>
  One of my pet peeves is that people slip “JavaScript” into the soup of
technologies they list on their resume, yet they can’t describe what a
closure or a prototype chain are.  Typically, these folks have used
"JavaScript" (meaning jQuery) to manipulate a series of DOM elements
and have never written an application, library, or node.js server using
the real language.  I’ve been especially hard when grading these folks.

* **Show your work**<br>
  Try to understand that I really want all interview candidates to do well.
I’m looking for any excuse to pass an interviewee, since failure means
that I have to do more interviews in the future.  If I ask a question of
a candidate and they spend 5 minutes in quiet thought, trying to work out
the solution, that’s 5 minutes where I have nothing good to write.  If a
candidate grabs a whiteboard marker, starts drawing a diagram, and tells
me their approach, I can at least write that they have a good thought
process and correct them if they’re wildly off track.

* **Do your homework**<br>
  If you already know the position you’re going to be interviewing for,
spend a couple of evenings and read up on the documentation or technology
you’ll be working with.  When I interviewed for a Developer Relations
role at Google, I spent a few nights going through all of code.google.com
(it was a lot smaller back then).  I think my interviewers were impressed
that I knew about the APIs and had some suggestions for ways that they
could improve their documentation.

* **Tailor your resume**<br>
  If your mission statement is "To work on high performance web server
database infrastructure" and you’re interviewing for a Developer
Advocate position, I’ll count that against you.  If the job needs
a Rails programmer and you emphasize your .NET experience, I’m not going
to think you’re going to be serious about the role.  I don't like to work
with people who aren't into what they do.  It takes about half an hour to
tailor a resume to a specific job position.  Remove stuff that doesn’t
apply to the position, and play up your strengths in areas which do.
This is time well spent.  Consider recruiters who have to read dozens
of resumes a day.  Are they going to spend 15 minutes grepping your
resume for the appropriate skillset, or are they going to pass until
they see a resume which more or less exactly matches the role they’re
trying to fill?  Which would you do?

One thing to keep in mind is that even with these tips, you're not going
to be able to pass the interview if you don't have a solid programming
background.  Not confident that your skills are up to snuff?  Then I
strongly recommend following [Aaron Boodman's excellent advice][1].

(Image by [Mr. Daniel Ted Feliciano][3])
