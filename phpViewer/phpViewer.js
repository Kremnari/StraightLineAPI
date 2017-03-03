j2pApp.controller("phpViewer", [
  '$timeout', 'phpMaker', function($timeout, phpMaker) {
    this.phpMaker = phpMaker;
  }
]);
