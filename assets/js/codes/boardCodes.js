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

/*
         * 
         * @type Element
         * Parametros básicos do sistema
         */
var container = document.getElementById("modelPanel")
var options = {
    layout: { randomSeed: 2}

}
var network

var nodes = []
var edges = []
var lastNode = 1

var boardNodes
var boardEdges

network = new vis.Network(container, {}, options)
network.on("doubleClick", function(){
    $("#modalCreateActivity").modal("show")
        return
})

/*
 * 
 * @returns {undefined}
 * Método usado para reinicializar a área de trabalho.
 */
function restartBoard(){
    
    network.destroy()
    network = null
    
    boardNodes = new vis.DataSet(nodes)
    boardEdges = new vis.DataSet(edges)

    const data = { nodes: boardNodes, edges: boardEdges }

    network = new vis.Network(container, data, options)

    network.on("doubleClick", onNetwork)

}

/*
         * 
         * @param {type} param
         * @returns {undefined}
         * 
         * Este método é usado para criar o evento do click duplo na área de trabalho
         */
let onNetwork = function (param) {
    /*
     * se o click duplo for feito no fundo da área de trabalho, abre o modal para criar uma atividade
     */
    if (param.nodes.length === 0 && param.edges.length === 0) {
        $("#modalCreateActivity").modal("show")
        return
    }
    
    /*
     * O código abaixo é executado sempre que uma transição for clicada
     * param é o atributo que bem da área de trabaho
     */
    if(param.edges.length > 0 && param.nodes.length === 0){
        
        const edgId = param.edges[0]
        
        let edge
        let i = 0
        
        for(i = 0; i < edges.length; i++){
            if(edges[i].id == edgId){
                edge = edges[i]
                break
            }
        }
        
        const trTbl = document.getElementById("tblTrInfo")
        
        while (trTbl.firstChild) {
            trTbl.removeChild(trTbl.lastChild);
        }
        
        const firstTR = document.createElement("tr")
        const firstTDLabel = document.createElement("th")
        firstTDLabel.appendChild(document.createTextNode("From Activity"))
        const firstTDValue = document.createElement("td")
        firstTDValue.appendChild(document.createTextNode(nodes[edge.from - 1].label))
        firstTR.appendChild(firstTDLabel)
        firstTR.appendChild(firstTDValue)
        trTbl.appendChild(firstTR)


        const secondTR = document.createElement("tr")
        const secondTDLabel = document.createElement("th")
        secondTDLabel.appendChild(document.createTextNode("To Activity:"))
        const secondTDValue = document.createElement("td")
        secondTDValue.appendChild(document.createTextNode(nodes[edge.to - 1].label))
        secondTR.appendChild(secondTDLabel)
        secondTR.appendChild(secondTDValue)
        trTbl.appendChild(secondTR)
        
        let weight = 0
        
        nodes[edge.from - 1].transitions.forEach(element => {
            if(element.to == edge.to){
                weight = element.weight
            }
        })

        const thirdTR = document.createElement("tr")
        const thirdTDLabel = document.createElement("th")
        thirdTDLabel.appendChild(document.createTextNode("Weight:"))
        const thirdTDValue = document.createElement("td")
        thirdTDValue.appendChild(document.createTextNode(weight))
        thirdTR.appendChild(thirdTDLabel)
        thirdTR.appendChild(thirdTDValue)
        trTbl.appendChild(thirdTR)
        
        document.getElementById("btnPModalUpdateTransition").setAttribute("edgIndex",i)
        document.getElementById("btnPModalUpdateTransition").addEventListener("click", function(event){
            
            const edge = edges[event.target.getAttribute("edgIndex")]
            
            const nodeFrom = nodes[edge.from - 1]
            
            let index = 0
            for(index = 0; index < nodeFrom.transitions.length; index++){
                if(nodeFrom.transitions[index].to == edge.to){
                    document.getElementById("trUpWeight").value = nodeFrom.transitions[index].weight
                    break
                }
            }
            
            document.getElementById("btnUpdateTransition").setAttribute("actId",nodeFrom.id)
            document.getElementById("btnUpdateTransition").setAttribute("trIndex", index)
            document.getElementById("btnUpdateTransition").setAttribute("edgIndex", event.target.getAttribute("edgIndex"))
            document.getElementById("btnUpdateTransition").addEventListener("click",updateTransition)
            
            $("#modalUpdateTransition").modal("show")
        })
        
        document.getElementById("btnDeleteTransition").setAttribute("fromId",edge.from)
        document.getElementById("btnDeleteTransition").setAttribute("ToId",edge.to)
        document.getElementById("btnDeleteTransition").addEventListener("click",deleteTransition)
        
        $("#modalTransitionInfo").modal("show")
        
        return
    }
    
    /*
     * 
     * @type Element
     * O código abaixo é executado sempre que uma atividade é clicada
     */

    const mainTable = document.getElementById("tblActInfo")

    while (mainTable.firstChild) {
        mainTable.removeChild(mainTable.lastChild);
    }

    const node = nodes[param.nodes[0] - 1]
    
    document.getElementById("Activityinformation").innerHTML = `Activity <b><i>${node.label}</i></b> Info:`

    const firstTR = document.createElement("tr")
    const firstTDLabel = document.createElement("th")
    firstTDLabel.appendChild(document.createTextNode("Activity Id"))
    const firstTDValue = document.createElement("td")
    firstTDValue.appendChild(document.createTextNode(node.id))
    firstTR.appendChild(firstTDLabel)
    firstTR.appendChild(firstTDValue)
    mainTable.appendChild(firstTR)


    const secondTR = document.createElement("tr")
    const secondTDLabel = document.createElement("th")
    secondTDLabel.appendChild(document.createTextNode("Activity Label:"))
    const secondTDValue = document.createElement("td")
    secondTDValue.appendChild(document.createTextNode(node.label.split(":")[1]))
    secondTR.appendChild(secondTDLabel)
    secondTR.appendChild(secondTDValue)
    mainTable.appendChild(secondTR)

    const thirdTR = document.createElement("tr")
    const thirdTDLabel = document.createElement("th")
    thirdTDLabel.appendChild(document.createTextNode("Activity Period:"))
    const thirdTDValue = document.createElement("td")
    thirdTDValue.appendChild(document.createTextNode(node.time))
    thirdTR.appendChild(thirdTDLabel)
    thirdTR.appendChild(thirdTDValue)
    mainTable.appendChild(thirdTR)

    const forthTR = document.createElement("tr")
    const forthTDLabel = document.createElement("th")
    forthTDLabel.appendChild(document.createTextNode("Activity Cost"))
    const forthTDValue = document.createElement("td")
    forthTDValue.appendChild(document.createTextNode(node.cost))
    forthTR.appendChild(forthTDLabel)
    forthTR.appendChild(forthTDValue)
    mainTable.appendChild(forthTR)

    const edgTable = document.getElementById("tblEdgInfo")

    while (edgTable.firstChild) {
        edgTable.removeChild(edgTable.lastChild);
    }

    if (node.transitions.length === 0) {
        edgTable.append(document.createTextNode("This activity has no transitions"))
    } else {

        const firstTR = document.createElement("tr")
        const firstTDTo = document.createElement("th")
        firstTDTo.appendChild(document.createTextNode("to-ID"))
        firstTR.appendChild(firstTDTo)
        const firstTDToLabel = document.createElement("th")
        firstTDToLabel.appendChild(document.createTextNode("to-label"))
        firstTR.appendChild(firstTDToLabel)
        const firstTDWeight = document.createElement("th")
        firstTDWeight.appendChild(document.createTextNode("weight"))
        firstTR.appendChild(firstTDWeight)
        edgTable.appendChild(firstTR)
        const firstTDOps = document.createElement("th")
        firstTDOps.appendChild(document.createTextNode("operation"))
        firstTR.appendChild(firstTDOps)
        edgTable.appendChild(firstTR)

        node.transitions.forEach(element => {
            const innerTR = document.createElement("tr")
            const innerTDTo = document.createElement("td")
            innerTDTo.appendChild(document.createTextNode(element.to))
            innerTR.appendChild(innerTDTo)
            
            const innerTDToLabel = document.createElement("td")
            innerTDToLabel.appendChild(document.createTextNode(nodes[element.to - 1].label.split(":")[1]))
            innerTR.appendChild(innerTDToLabel)
            
            const innerTDWeight = document.createElement("td")
            innerTDWeight.appendChild(document.createTextNode(element.weight))
            innerTR.appendChild(innerTDWeight)
            
            const innerTDOps = document.createElement("td")
            const deleteTransitionLink = document.createElement("button")
            deleteTransitionLink.setAttribute("class","btn btn-link deleteTransition")
            deleteTransitionLink.setAttribute("toId",element.to+"")
            deleteTransitionLink.setAttribute("fromId",node.id+"")
            deleteTransitionLink.appendChild(document.createTextNode("delete"))
            innerTDOps.appendChild(deleteTransitionLink)
            innerTR.appendChild(innerTDOps)
            edgTable.appendChild(innerTR)
            
            $(".deleteTransition").on("click",deleteTransition)
        })
    }

    document.getElementById("btnInsertTransition").setAttribute("trId", node.id)
    document.getElementById("btnDeleteActivity").setAttribute("trId", node.id)
    const updateButton = document.getElementById("btnPModalUpdateActivity")
    updateButton.setAttribute("actId", node.id)
    updateButton.addEventListener("click", function(event){
        
        const form = document.forms[2]
        
        form.getElementsByTagName("input")[0].value = node.id
        form.getElementsByTagName("input")[1].value = node.activityLabel
        form.getElementsByTagName("input")[2].value = node.time
        form.getElementsByTagName("input")[3].value = node.cost
        
        $("#modalUpdateActivity").modal("show")
        
    })

    $("#modalActivityInfo").modal("show")
}

document.getElementById("btnGnrJSON").addEventListener("click", function(){
            
    const jso = JSON.parse(JSON.stringify(nodes))
    
    for(let i = 0; i < jso.length; i++){
        delete jso[i].physics
    }

    txtAreaJson = document.getElementById("txtAreaGnrJSON")

    txtAreaJson.value = JSON.stringify(jso)

})

document.getElementById("btnLoadJSON").addEventListener("click", function(){
    let auxNodes = []
    try{
        auxNodes = JSON.parse(document.getElementById("txtAreaLoadJSON").value)

    }catch(e){
        alert("there are problems with your JSON")
        document.getElementById("txtAreaLoadJSON").value = ""

        return
    }

    nodes = auxNodes
    
    nodes.forEach(el => {
        el.physics = false
    })

    edges = []

    for(let i = 0; i < nodes.length; i++){

        for(let j = 0; j < nodes[i].transitions.length; j++){
            edges.push({
                from: nodes[i].id,
                to: nodes[i].transitions[j].to,
                label: nodes[i].transitions[j].weight+"",
                arrows: {
                    to: {
                        enabled: true,
                        type: "arrow",
                    }
                },
                
            })
        }

    }

    lastNode = nodes.length + 1

    restartBoard()

})

/*
* Esteé o botão que fica dentro do modal que gera o JSON
*/
document.getElementById("btnCopyJSON").addEventListener("click", function(){
            
    const jso = JSON.parse(JSON.stringify(nodes))
    
    for(let i = 0; i < jso.length; i++){
        delete jso[i].physics
    }

    navigator.clipboard.writeText(JSON.stringify(jso))
    
    alert("JSON Copied")

})