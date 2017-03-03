<?php
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class db {
    const DRIVER = 'MONGO';
    private static $__staticVar = null;
    private $__uidField = "#{DEFAULT_UIDFIELD}#";
    private $__m = null; //mongo instance
    private $__t = null; //table access
    private $__q = []; //query
    private $__o = []; //operation
            
    private function __construct() {
        $__mc = new MongoClient();
        #{SERVERVARS}#
    }
    /*
     * userID is called before db execution.
     * This is to prevent addQuery from overwritting the userid field
     * This way would instead overwrite anything in the userid field from addQuery
     * 
     * see switchUIDfield
     */
    private function __userID() {
        #{UIDFUNCTION}#
        $__q[$__uidField] = $uid;
    }
    /*
     * Primary Functions
     */
    public function get() {
        //$__t check and fail if null
        $items = $__t->find($__q);
        return iterator_to_array($items);
    }
    public function count() {
        return $__t->find($__q)->count();
    }
    public function verify() {
        //$__t check and fail if null
        return $__t->find($__q)->count() > 0;
    }
    public function add() {
        $__t->insert($__q, $__o);
        return $__q; //mongoID is added
    }
    public function modify() {
        $__t->update($__q, $__o);
        // Should return something ....??
    }
    public function delete() {
        
        $__t->delete($__q);
    }
    /*
     * Chain Methods
     * for easier manipulation
     */
    
    /*
     * switch UID field allows the userId to be placed in a different location for the query
     * The main point of this is to evaluate logged in users' access to another users' data
     * For userA to allow userB access, the access is likely stored under userA's ownership
     * with userB logged in, we'd need to switch the UID field to allow the db poll to view userA's stuff
     */
    public function switchUIDfield($field) {
        $__uidField = $field;
        return $this;
    }
    public function revertUIDfield() {
        $__uidField = "#{DEFAULT_UIDFIELD}#";
        return $this;
    }
    public function setTable($table) {
        $__t = $__m->{$table};
        return $this;
    }
    public function setQuery($query) {
        $__q = $query;
        return $this;
    }
    public function addQuery($key, $value) {
        $__q[$key] = $value;
        return $this;
    }
    /*
     * Ops/operation
     * This is the functional part of insert/update operations
     * Since we're using a builder pattern, only one should be done at a time
     */
    public function setOps($operation) {
        $__o = $operation;
        return $this;
    }
    public function addOps($key, $value) {
        $__o[$key] = $value;
        return $this;
    }
}