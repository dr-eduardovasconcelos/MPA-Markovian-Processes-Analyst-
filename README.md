# MPA-Markovian-Processes-Analyst-

MPA is a small program for business process analysis. This program is entirely made in HTML5 and executes on your web browser. 
This program uses the vis.js library and there are no guarantees that it will work on old versions or exotic web browsers.

--How can I start MPA?

Access the git-hub main page of the project, click the button "code" then click on "download zip". Once you have the zip file
extract its content wherever you want and execute MPA.html. This program has been tested only on Safari and Chrome. If you have any
problem with any other web browser, please, contact me.

--How can I use MPA?

There is a help link on the top-right of the page, there, you can have an idea of how to use the system. You can also watch
this video https://youtu.be/052JjBkhKwk. In this video, I show the basic steps to use the system. There is a little problem that is easy
to overcome. The lesson is in Portuguese, which is not a big problem for those who have a little creativity :)

--What kind of analysis can I do?

This program uses the MTTF(Meantime to Failure) statistic to determine the average time the process reaches one of its final
states. The great advantage of using CTMC(Continuous Time Markov Chain) formalism to do it is that we can compute the MTTF
independent of the format of the model(process). Beyond the average time to finish the process, it is possible to compute
the average cost of the entire process, as well as the average cost of individual activities. Another important metric 
is the probability of the end activities being reached.

If you are curious of how the MTTF is calculated, please, consult https://arxiv.org/abs/2202.00674.

--How can I Help you to improve this system

This program is free to use and you can modify it as you wish, since you respect the terms of the GPL v.3 License.
You can help me to improve this project by sending me new features and eventual bugs that you face when using it. 
If you have any sugestion or what to report bugs, please, send me mail: eduardo.vasconcelos@recife.ifpe.edu.br.
