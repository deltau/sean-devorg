/**
 * Created by smcinturff on 10/13/21.
 */

import {api, LightningElement, track, wire} from 'lwc';
import getSolutionDomains from '@salesforce/apex/lwCollateralIdController.getSolutionDomains';
import getProducts from '@salesforce/apex/lwCollateralIdController.getProducts';

export default class LwCollateralId extends LightningElement {
    @api location;
    @track currentSolutionDomainId;
    @track mySolutionDomains=[];
    @track currentProducts=[];
    productSet = [];
    error;

    defaultSolutionDomain = 'inProgress';
    defaultProduct = '';

    @wire(getSolutionDomains)
    wireSolutionDomains({data,error}) {
        if(data) {
            console.log('wireRecord');
            console.log(data);

            let mySolutionDomains=[];

            for (let key of data) {
                console.log(key);
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
                console.log(key);
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

    get products() {
        return this.currentProducts;
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
        console.log('--- DETAIL ---');
        console.log(event.detail);
        console.log('Detail Value: ' + event.detail.value);


        if (event.target.name === 'SOLUTION-DOMAIN') {

            this.currentSolutionDomainId = event.target.value;
            console.log('1');

            console.log('4');
            this.currentProducts = this.reevaluateProducts();
            console.log('5');
        }
        this.value = event.detail.value;
    }

    reevaluateProducts() {
        let myProducts = [];

        for (let product of this.productSet) {
            console.log('2');
            // console.log(product);
            if (product.UCM_Solution_Domain__c === this.currentSolutionDomainId) {
                console.log('3');
                myProducts.push({label: product.Name, value: product.Id});
            }
        }

        return myProducts;
    }


}