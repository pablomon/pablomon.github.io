@echo --- pablomon.github.io ---
@echo ..
@echo ..
@echo Opening Sublime project
@echo off
C:\"Program Files\Sublime Text 3"\subl --project D:\DEVELOPER\pablomon.github.io\pablomonProject.sublime-project

PING localhost -n 2 >NUL
if not DEFINED IS_MINIMIZED set IS_MINIMIZED=1 && start "" /min "%~dpnx0" %* && exit

cd d:\developer\"pablomon.github.io"
@echo on
jekyll s --drafts
exit
