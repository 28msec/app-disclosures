US-GAAP Disclosures website & ipad app
--------------------------------------

This repository holds the ipad app & website.


Development setup steps
----------------------------

- install nodejs : http://nodejs.org/download/
- install git: http://git-scm.com/downloads/
- install xcode: https://itunes.apple.com/us/app/xcode/id497799835?mt=12
- install grunt, bower and phonegap

```
npm install -g grunt grunt-cli bower phonegap
```

- add the path to the git.exe (C:\Program Files (x86)\Git\bin\) to the PATH system variable
- clone the repository
- in the repository directory, execute the install commands for serverside components (npm) and clientside components (bower)

```
npm install
bower install
```

- start the development server

```
grunt server
```

This should open a new browser on localhost:9008.
The port can be customized in Gruntfile.js, if that port is not available.

- build the ipad app

```
grunt phonegap:run:ios
```

