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
* Este é o evento do botão que abre o modal para a criação de uma transição.
* ele cria preenche os campos e impede que ocorram transições indesejadas
*/
document.getElementById("btnInsertTransition").addEventListener("click", function (event) {

    const selectTo = document.forms[1].getElementsByTagName("select")[0]
    const node = nodes[event.target.getAttribute("trId") - 1]

    while (selectTo.lastChild) {
        selectTo.removeChild(selectTo.firstChild)
    }

    nodes.forEach(element => {

        if (element.id !== node.id) {
            let haveIThisTransition = false
            for (let i = 0; i < node.transitions.length; i++) {
                if (element.id === node.transitions[i].to) {
                    haveIThisTransition = true
                    break
                }
            }
            if (haveIThisTransition === false) {
                const opt = document.createElement("option")
                opt.setAttribute("value", element.id)
                opt.appendChild(document.createTextNode(element.label))
                selectTo.appendChild(opt)
            }
        }

    })

})


/*
 * Este método é usado para criar uma transição entre duas atividades
 * 
 */
const createTransition = function () {
    const selectTo = document.forms[1].getElementsByTagName("select")[0]
    if (selectTo.value == "") {
        alert("You need to select an activity to create a transition")
        return
    }
    const node = nodes[document.getElementById("btnInsertTransition").getAttribute("trId") - 1]
    const nodeTo = nodes[parseInt(selectTo.value) - 1]

    let w = document.forms[1].getElementsByTagName("input")[0].value

    if (w === "") {
        w = 1
    }

    if (isNaN(w) || w <= 0) {
        alert("the weight needs to be a number greater than 0")
        document.forms[1].getElementsByTagName("input")[0].value = ""
        return
    }

    node.transitions.push({ to: nodeTo.id, weight: parseFloat(w) })
    
    if(node.id!=1)
        delete node.color

    edges.push({from: node.id, 
        to: nodeTo.id, 
        label: w+"",
        arrows: {
            to: {
                enabled: true,
                type: "arrow",
            }
        }
    })
    
    document.forms[1].getElementsByTagName("input")[0].value = ""
    
    $("#modalActivityInfo").modal("hide")
    
    restartBoard()


}

/*
 * Código usado para deletar transições
 * Este método é usado dentro do código de atualização do quadro que está no arquivo boardCodes.js.
 */
let deleteTransition = function(event){
    
    const conf = confirm("Are you sure you want to delete this transition?")
    
    if(!conf)
        return
    
    const nodeTo = nodes[event.target.getAttribute("toId") - 1]
    const nodeFrom = nodes[event.target.getAttribute("fromId") -1]
    
    for(let i = 0; i < nodeFrom.transitions.length; i++){
        if(nodeFrom.transitions[i].to === nodeTo.id){
            nodeFrom.transitions.splice(i,1)
            break
        }
    }
    
    for(let i = 0; i < edges.length; i++){
        if(edges[i].from === nodeFrom.id && edges[i].to === nodeTo.id){
            edges.splice(i, 1)
            break
        }
    }
    
    if(nodeFrom.id != 1 && nodeFrom.transitions.length === 0){
        nodeFrom.color = "#dddddd"
    }
    
    $("#modalActivityInfo").modal("hide")
    $("#modalTransitionInfo").modal("hide")
    
    restartBoard()
    
}

/*
* Código usado para atualizar os pesos das atividades
* Este método é usado dentro do código de atualização do quadro que está no arquivo boardCodes.js.
*/
let updateTransition = function(event){
    
    const conf = confirm("Are you sure you want to update this transition?")
    
    if(!conf)
        return
    
    const node = nodes[event.target.getAttribute("actId") - 1]
    const edge = edges[event.target.getAttribute("edgindex")]
    const trIndex = event.target.getAttribute("trIndex")
    
    const newWeight = document.getElementById("trUpWeight").value
    
    node.transitions[trIndex].weight = parseFloat(newWeight)
    
    edge.label = newWeight
    
    $("#modalTransitionInfo").modal("hide")
    
    restartBoard()
    
}

document.getElementById("btnCreateTransition").addEventListener("click", createTransition)