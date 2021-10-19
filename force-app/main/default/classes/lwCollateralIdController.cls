/**
 * Created by smcinturff on 10/15/21.
 */

public with sharing class lwCollateralIdController {

    @AuraEnabled(Cacheable=true)
    public static List<UCM_Solution_Domain__c> getSolutionDomains(){
        List<UCM_Solution_Domain__c> myList = [SELECT Id, Name FROM UCM_Solution_Domain__c];
        return myList;
    }

    @AuraEnabled(Cacheable=true)
    public static List<UCM_Product__c> getProducts() {
        List<UCM_Product__c> myProducts = [SELECT Id, Name, UCM_Solution_Domain__c FROM UCM_Product__c];
        return myProducts;
    }
}