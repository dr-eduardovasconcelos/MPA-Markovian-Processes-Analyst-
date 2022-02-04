
function calculateMTTF(chain /*Object representing the chain*/){
    /*
        chain is an array of states

        state{
            number: integer,
            isInitialState: boolean,
            transitions: [
                {
                    rate: double,
                    to: integer
                }
            ]
        }

        if the attribute transitions is undefined or equal to 0, the state is an absorbing state.
 
    */

    /**
     * Validation phase
     */

    /**
     * verifying the existence of absorbing states, unreached states
     * and the initial state
     */
    let isThereAbsorbingStates = false;
    let initialState = 0;
    let isThereAnInitialState = false;

    chain.forEach( (element,index) => {

        if(element.transitions == undefined || element.transitions.length===0){
            element.isAbsorbing = true;
            isThereAbsorbingStates = true;

            if(element.isInitialState){
                throw new ChainException(`state ${element.number} is the initial state and is an absortion state`, "illegalInitialStateException");
            }

        }else{
            if(element.isInitialState){
                initialState = index;
                if(isThereAnInitialState){
                    throw new ChainException(`The chain has multiple initial states`, "illegalInitialStateException");
                }
                isThereAnInitialState = true;
            }
            element.isAbsorbing = false;

            for(let i = 0;i < element.transitions.length; i++){

                /**
                 * Verifying if the chain has a self transition
                 */
                if(element.transitions[i].to === element.number)
                    throw new ChainException(`state ${element.number} has a self transition`, "SelfTransitionException");

                for(let j = 0; j<chain.length; j++){

                    if(chain[j].number === element.transitions[i].to){
                        chain[j].isReached = true;
                        break;
                    }
                }
            }
           
        }
        
    });

    if (!isThereAbsorbingStates){
        throw new ChainException("The chain has not absorbing states","NotAnAbsortionChainException");
    }

    /**
     * Verifying if there is unreached states.
     * If theres is more than one unreached states, the chain is incorrect.
     * If there is one unreached state, it must be the first state.
     */
    for(let i = 0; i<chain.length; i++ ){
        
        if(chain[i].isReached == undefined || !chain[i].isReached){
            if(chain[i].isInitialState == undefined || !chain[i].isInitialState){
                throw new ChainException("The unreached state is not the initial state","InvalidChainException");
            }
        }
    }

    if(chain[initialState].isAbsorbing){
        throw new ChainException(`The state ${chain[initialState].number} is unreached and absorbing`,"InvalidChainException");
    }


    /**
     * Inserting the repair transitions in absorbing states
     */
    chain.forEach(element => {
        if (element.isAbsorbing){
            element.transitions = [];
            element.transitions.push({rate:1.0,to:chain[initialState].number});
        }
    })

    //console.log(infMatrix);

    /**
     * contains the array of steady state probabilities of the chain
     */
    const solution = CalculateSteadyStateProbabilitiesArray(chain);

    let availability = 0.0;
    let unavailability = 0.0;

    /** 
     * Calculating the MTTF=A'/U'
     */
    for(let i = 0; i<solution.length;i++){
        if(!chain[i].isAbsorbing){
            availability+=solution[i];
        }else{
            unavailability+=solution[i];
        }
    }

    const result = {};
    
    result.mttf = availability/unavailability;
    result.statePeriods = [];
    result.absortionProbabilities = [];
    for(let i = 0;i<chain.length;i++){
        if(!chain[i].isAbsorbing)
            result.statePeriods.push({number:chain[i].number,period:result.mttf*(solution[i]/availability)})
        else
            result.absortionProbabilities.push({number:chain[i].number,probability:solution[i]/unavailability});
    }
    

    return result;

}

function ChainException(message,name){
    this.message = message;
    this.name = name;
}

/**
 * 
 * This function calculates the steady state probabilities of an closed ctmc through 
 * a solution of a system of linear equations.
 */
function CalculateSteadyStateProbabilitiesArray(chain /*An object containing */){

    chain.forEach( (element,index) => {

        if(element.transitions == undefined || element.transitions.length===0){

            throw new ChainException(`state ${element.number} is the is an absortion state.`, "illegalInitialStateException");

        }else{

            for(let i = 0;i < element.transitions.length; i++){

                /**
                 * Verifying if the chain has a self transition
                 */
                if(element.transitions[i].to === element.number)
                    throw new ChainException(`state ${element.number} has a self transition`, "SelfTransitionException");

                for(let j = 0; j<chain.length; j++){

                    if(chain[j].number === element.transitions[i].to){
                        chain[j].isReached = true;
                        break;
                    }
                }
            }
           
        }
        
    });

    for(let i = 0; i < chain.length; i++){
        if(chain[i].isReached == undefined || !chain[i].isReached){
            throw new ChainException(`state ${element.number} is unreached`, "UnreachedStateException");
        }
    }

    /**
     * Building the infinitesimal matrix
     */
    let infMatrix = new Array(chain.length);
    //infMatrix.forEach(element => element = new Array(chain.length));

    for(let i = 0; i<infMatrix.length; i++){
        infMatrix[i] = new Array(chain.length+1);
        for(let j = 0; j<infMatrix[0].length; j++){
            infMatrix[i][j] = 0.0;
        }
    }

    /**
     * Generating the matrix of rates according to the linear system
     */
    chain.forEach((element,index) => {

        let rateCount = 0;
        for(let i = 0; i<element.transitions.length; i++){
            rateCount += element.transitions[i].rate;
            let transitionIndex = 0;

            for(let j = 0; j < chain.length; j++){
                if(chain[j].number === element.transitions[i].to){
                    transitionIndex = j;
                    break;
                }
            }

            
            infMatrix[transitionIndex][index] = element.transitions[i].rate;
        }

        infMatrix[index][index] = -1 * rateCount;
    });

    /**
     * inserting the sum of probabilities in the last line of infinitesimal matrix
     */
    for(let i = 0; i<chain.length+1 ; i++){
        infMatrix[chain.length-1][i] = 1;
    }

    /**
     * returns the array of steady state probabilities of the chain
     */
    return gauss(infMatrix);


}


/**
 * Function under GPL v.3, obtained from
 * https://github.com/itsravenous/gaussian-elimination/blob/master/gauss.js
 */
function gauss(A) {
    var n = A.length;

    for (var i=0; i<n; i++) {
        // Search for maximum in this column
        var maxEl = Math.abs(A[i][i]);
        var maxRow = i;
        for(var k=i+1; k<n; k++) {
            if (Math.abs(A[k][i]) > maxEl) {
                maxEl = Math.abs(A[k][i]);
                maxRow = k;
            }
        }

        // Swap maximum row with current row (column by column)
        for (var k=i; k<n+1; k++) {
            var tmp = A[maxRow][k];
            A[maxRow][k] = A[i][k];
            A[i][k] = tmp;
        }

        // Make all rows below this one 0 in current column
        for (k=i+1; k<n; k++) {
            var c = -A[k][i]/A[i][i];
            for(var j=i; j<n+1; j++) {
                if (i==j) {
                    A[k][j] = 0;
                } else {
                    A[k][j] += c * A[i][j];
                }
            }
        }
    }

    // Solve equation Ax=b for an upper triangular matrix A
    var x= new Array(n);
    for (var i=n-1; i>-1; i--) {
        x[i] = A[i][n]/A[i][i];
        for (var k=i-1; k>-1; k--) {
            A[k][n] -= A[k][i] * x[i];
        }
    }
    return x;
}

//module.exports[calculateMTTF,ChainException]