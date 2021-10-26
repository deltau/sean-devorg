/**
 * Created by smcinturff on 10/13/21.
 */

import {api, LightningElement, track, wire} from 'lwc';
import getSolutionDomains from '@salesforce/apex/lwCollateralIdController.getSolutionDomains';
import getProducts from '@salesforce/apex/lwCollateralIdController.getProducts';
import getCollateral from '@salesforce/apex/lwCollateralIdController.getCollateral';

export default class LwCollateralId extends LightningElement {
    @api location;
    @track selectedSolutionDomainId;
    @track selectedProductId;
    @track mySolutionDomains=[];
    @track currentProducts=[];
    @track currentCollateral=[];
    @track collateralDisabled = true;

    productSet = [];
    collateralSet = [];
    error;

    defaultSolutionDomain = 'inProgress';
    defaultProduct = '';
    @track defaultCollateral = '';

    @wire(getSolutionDomains)
    wireSolutionDomains({data,error}) {
        if(data) {
            console.log('getSolutionDomains');
            console.log(data);

            let mySolutionDomains=[];

            for (let key of data) {
                // console.log(key);
                mySolutionDomains.push({label: key.Name, value: key.Id});

            }
            console.log('mySolutionDomains');
            console.log(mySolutionDomains);

            this.mySolutionDomains = mySolutionDomains;

            console.log('this.solutionDomains');
            console.log(this.solutionDomains);
            this.error = undefined;
        }
        else {
            this.error = error;
            this.data = undefined;
        }
    }

    @wire(getProducts)
    wireProducts({data, error}) {

        if(data) {
            let myProducts = [];

            console.log('getProducts');
            console.log(data);

            for (let key of data) {
                // console.log(key);
                this.productSet.push(key);
                myProducts.push({label: key.Name, value: key.Id});
            }

            this.currentProducts = myProducts;
            this.error = undefined;
        } else {
            this.error = error;
            this.data = undefined;
        }
    }

    @wire(getCollateral)
    wireCollateral({data, error}) {

        if(data) {
            let myCollateral = [];

            console.log('getCollateral');
            console.log(data);

            for (let key of data) {
                console.log(key);
                this.collateralSet.push(key);
                myCollateral.push({label: key.UCM_Collateral__r.Name, value: key.UCM_Collateral__c});
            }

            this.currentCollateral = myCollateral;
            this.error = undefined;
        } else {
            this.error = error;
            this.data = undefined;
        }
    }

    get products() {
        return this.currentProducts;
    }

    get collateral() {
        return this.currentCollateral;
    }
    
    get solutionDomains() {
        // let mySolutionDomains=[];

        // this.solutionDomains.forEach(function(solutionDomain){
        // for (let key in this.solutionDomains) {
        //     mySolutionDomains.push({label: this.solutionDomains[key].Name, value: this.solutionDomains[key].Name});
        //     // mySolutionDomains.put({label: solutionDomain.Name, value: solutionDomain.Name});
        // }
        // console.log('getOptions: ');
        // console.log(mySolutionDomains);

        return this.mySolutionDomains;

        // return [
        //     { label: 'New', value: 'new' },
        //     { label: 'In Progress', value: 'inProgress' },
        //     { label: 'Finished', value: 'finished' },
        // ];
    }

    handleChange(event) {
        console.log(event.target);
        console.log('Name: ' + event.target.name);
        console.log('Target Value: ' + event.target.value);
        console.log('Detail Value: ' + event.detail.value);

        switch (event.target.name) {
            case 'SOLUTION-DOMAIN':
                this.selectedSolutionDomainId = event.target.value;
                this.selectedProductId = '';
                this.defaultCollateral = '';
                this.collateralDisabled = true;
                console.log('1');

                console.log('4');
                this.currentProducts = this.reevaluateProducts();
                this.currentCollateral = this.reevaluateCollateral();
                console.log('5');
                break;

            case 'PRODUCT':
                this.selectedProductId = event.target.value;
                this.defaultCollateral = '';
                this.currentCollateral = this.reevaluateCollateral();
                break;
        }
        // if (event.target.name === 'SOLUTION-DOMAIN') {
        //
        //     this.selectedSolutionDomainId = event.target.value;
        //     console.log('1');
        //
        //     console.log('4');
        //     this.currentProducts = this.reevaluateProducts();
        //     console.log('5');
        // }

        this.value = event.detail.value;
    }

    reevaluateProducts() {
        console.log('reevaluateProducts');
        let myProducts = [];

        for (let product of this.productSet) {
            console.log('2');
            // console.log(product);
            if (product.UCM_Solution_Domain__c === this.selectedSolutionDomainId) {
                console.log('3');
                myProducts.push({label: product.Name, value: product.Id});
            }
        }

        // if (myProducts.length > 0) {
        //     this.collateralDisabled = false;
        // }
        return myProducts;
    }

    reevaluateCollateral() {
        console.log('reevaluateCollateral');
        console.log('selectedProductId: ' + this.selectedProductId);
        console.log(this.collateralSet);

        let myCollateral = [];

        for (let collateral of this.collateralSet) {
            console.log('2');
            // console.log(product);
            if (collateral.UCM_Products__c === this.selectedProductId) {
                console.log('3');
                myCollateral.push({label: collateral.UCM_Collateral__r.Name, value: collateral.UCM_Collateral__c});
            }
        }
        console.log(myCollateral);
        if (myCollateral.length > 0) {
            this.collateralDisabled = false;
        }
        return myCollateral;
    }

}