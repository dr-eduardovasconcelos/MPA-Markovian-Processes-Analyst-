/*
    This file is part of Markovian Processes Analyst (MPA).

    MPA is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    MPA is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with MPA.  If not, see <https://www.gnu.org/licenses/>.
*/

document.getElementById("btnPerfAnalysis").addEventListener("click",function(event){

    const chain = []

    nodes.forEach((element, index) => {

        chain.push({
                number: element.id,
                isInitialState: false,
                transitions:[]

        })

        let sumProbabilities = 0;

        for(let i = 0; i < element.transitions.length; i++){
            sumProbabilities += element.transitions[i].weight
        }

        for(let i = 0; i < element.transitions.length; i++){
            chain[index].transitions.push({
                to: element.transitions[i].to,
                rate: (1.0/element.time)*(element.transitions[i].weight/sumProbabilities)
            })
        }

        if(element.id === 1){
            chain[index].isInitialState = true
        }

    })

    let result

    event.target.setAttribute("enabled","false")

    try{
        result = calculateMTTF(chain)
    }catch(e){
        alert(e.message)
        return
    }finally{
        event.target.setAttribute("enabled","true")
    }

    document.getElementById("MTTFInfo").innerHTML = result.mttf.toFixed(4)

    const tblActRes = document.getElementById("tblActRes")

    while(tblActRes.firstChild){
        tblActRes.removeChild(tblActRes.lastChild)
    }

    const headerTR = document.createElement("tr")

    const headerTHId = document.createElement("th")
    headerTHId.appendChild(document.createTextNode("ID"))
    headerTR.appendChild(headerTHId)

    const headerTHLabel = document.createElement("th")
    headerTHLabel.appendChild(document.createTextNode("Label"))
    headerTR.appendChild(headerTHLabel)

    const headerThPeriod = document.createElement("th")
    headerThPeriod.appendChild(document.createTextNode("Execution Time"))
    headerTR.appendChild(headerThPeriod)

    const headerTHCost= document.createElement("th")
    headerTHCost.appendChild(document.createTextNode("Total Cost"))
    headerTR.appendChild(headerTHCost)

    tblActRes.appendChild(headerTR)

    let totalCost = 0

    result.statePeriods.forEach((element, index) =>{

        const currNode = nodes[element.number - 1]

        const innerTR = document.createElement("tr")

        const innerTDId = document.createElement("td")
        innerTDId.appendChild(document.createTextNode(currNode.id))
        innerTR.appendChild(innerTDId)

        const innerTDLabel = document.createElement("td")
        innerTDLabel.appendChild(document.createTextNode(currNode.activityLabel))
        innerTR.appendChild(innerTDLabel)

        const innerTDPeriod = document.createElement("td")
        innerTDPeriod.appendChild(document.createTextNode(element.period.toFixed(4)))
        innerTR.appendChild(innerTDPeriod)

        const innerTDCost= document.createElement("td")
        innerTDCost.appendChild(document.createTextNode((currNode.cost * element.period).toFixed(4)))
        innerTR.appendChild(innerTDCost)

        totalCost += (currNode.cost * element.period)

        tblActRes.appendChild(innerTR)
        
    })

    const tblAbsRes = document.getElementById("tblAbsRes")

    while(tblAbsRes.firstChild){
        tblAbsRes.removeChild(tblAbsRes.lastChild)
    }

    const headerTR2 = document.createElement("tr")

    const headerTHId2 = document.createElement("th")
    headerTHId2.appendChild(document.createTextNode("ID"))
    headerTR2.appendChild(headerTHId2)

    const headerTHLabel2 = document.createElement("th")
    headerTHLabel2.appendChild(document.createTextNode("Label"))
    headerTR2.appendChild(headerTHLabel2)

    const headerThPeriod2 = document.createElement("th")
    headerThPeriod2.appendChild(document.createTextNode("Occurrence Probabilities"))
    headerTR2.appendChild(headerThPeriod2)


    tblAbsRes.appendChild(headerTR2)

    result.absortionProbabilities.forEach(element => {

        const currNode = nodes[element.number - 1]

        const innerTR = document.createElement("tr")

        const innerTDId = document.createElement("td")
        innerTDId.appendChild(document.createTextNode(currNode.id))
        innerTR.appendChild(innerTDId)

        const innerTDLabel = document.createElement("td")
        innerTDLabel.appendChild(document.createTextNode(currNode.activityLabel))
        innerTR.appendChild(innerTDLabel)

        const innerTDPeriod = document.createElement("td")
        innerTDPeriod.appendChild(document.createTextNode((element.probability * 100).toFixed(4)+"%"))
        innerTR.appendChild(innerTDPeriod)

        tblAbsRes.appendChild(innerTR)
    })

    document.getElementById("processCostInfo").innerHTML = totalCost.toFixed(4)

    $("#modalResult").modal("show")

})