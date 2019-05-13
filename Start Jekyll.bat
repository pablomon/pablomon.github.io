@echo --- pablomon.github.io ---
@echo ..
@echo ..
PING localhost -n 2 >NUL
if not DEFINED IS_MINIMIZED set IS_MINIMIZED=1 && start "" /min "%~dpnx0" %* && exit

cd d:\developer\"pablomon.github.io"
@echo on
jekyll s --drafts
exit
