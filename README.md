# PhatACOneHitKill
One hit kill hack for melee characters on PhatAC servers

To use:

1. Download Node v7.3.0 or later.
2. Clone or download this repo.
3. Navigate in terminal (command prompt) app to the directory you downloaded the repo to.
4. Run 'npm install'
5. Run 'node ./server'
6. Select '1' to open up a server on port 6969
7. Select one of the 4 predefined servers (for example, select '2' for HighTide)

After running the steps above, you will have a local middleman server running that will route to the server specified.

Now, all you need to do is EITHER of the following:
1. Add a server to Thwarg-Launcher at the address "127.0.0.1:6969"
2. Start AC with the command line arguments "-h 127.0.0.1 -p 6969"

Once connected, all of your melee attacks will kill anything in one hit (unless they evade)