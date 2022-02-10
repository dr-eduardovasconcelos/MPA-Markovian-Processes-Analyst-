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
         * @returns {undefined}
         * Este método é usado no evento que cria uma atividade
         */
let createActivity = function () {

    let label = document.forms[0].getElementsByTagName("input")[0].value
    let isLabelExistent = false
    let time = document.forms[0].getElementsByTagName("input")[1].value
    let cost = document.forms[0].getElementsByTagName("input")[2].value

    nodes.forEach((element) => {
        if (element.label.split(":")[1] === label) {
            alert(`the label ${label} is already been used in another activity`)
            document.forms[0].getElementsByTagName("input")[0].value = ""
            isLabelExistent = true
            return
        }
    })

    if (isLabelExistent) {
        return
    }

    if (time == "") {
        time = 1
    }

    if (cost == "") {
        cost = 1
    }

    if (isNaN(time)) {
        alert("type a number on activity duration field")

        document.forms[0].getElementsByTagName("input")[1].value = ""
        return;
    }

    if (isNaN(cost)) {
        alert("type a number on activity cost field")

        document.forms[0].getElementsByTagName("input")[2].value = ""
        return
    }

    time = parseFloat(time)
    cost = parseFloat(cost)

    if (time <= 0) {
        alert("type a period > 0")
        document.forms[0].getElementsByTagName("input")[1].value = ""
        return
    }

    if (cost <= 0) {
        alert("type a cost > 0")
        document.forms[0].getElementsByTagName("input")[2].value = ""
        return
    }

    document.forms[0].getElementsByTagName("input")[0].value = ""
    document.forms[0].getElementsByTagName("input")[1].value = ""
    document.forms[0].getElementsByTagName("input")[2].value = ""
    
    if(lastNode!=1){
        nodes.push({
            id: lastNode++,
            label: `#${lastNode - 1}:${label}`,
            activityLabel: label,
            time: time,
            cost: cost,
            transitions: [],
            color: "#dddddd",
            physics: false
        })
    }else{
        nodes.push({
            id: lastNode++,
            label: `#${lastNode - 1}:${label}`,
            activityLabel: label,
            time: time,
            cost: cost,
            transitions: [],
            color: "#dda0a0",
            physics: false
        })
    }

    restartBoard()

}

/*
 * 
 * @returns {undefined}
 * Método usado para alterar as informações de uma atividade
 */
let updateActivity = function(){
    
    const conf = confirm("Are you sure you want to update this activity?")
    
    if(!conf){
        return
    }
    
    const updateForm = document.forms[2]
    
    const id = updateForm.getElementsByTagName("input")[0].value
    let label = updateForm.getElementsByTagName("input")[1].value
    let time = updateForm.getElementsByTagName("input")[2].value
    let cost = updateForm.getElementsByTagName("input")[3].value
    
    if(isNaN(time)){
        alert("type a number on activity duration field")
        return
    }
    
    if(time === ""){
        time = 1
    }
    
    if(isNaN(cost)){
        alert("type a number on cost field")
        return
    }

    time = parseFloat(time)
    cost = parseFloat(cost)

    if (time <= 0) {
        alert("type a period > 0")
        document.forms[0].getElementsByTagName("input")[1].value = ""
        return
    }

    if (cost <= 0) {
        alert("type a cost > 0")
        document.forms[0].getElementsByTagName("input")[2].value = ""
        return
    }
    
    if(cost === ""){
        cost = 1
    }
    
    const node = nodes[id-1]
    
    node.activityLabel = label
    node.label = `#${id}:${label}`
    node.time = time
    node.cost = cost
    
    restartBoard()
    
    $("#modalActivityInfo").modal("hide")
    
    
}

/*
         * este código é usado para deletar uma atividade
         */

const deleteActivity = function(event){
            
    const node = nodes[event.target.getAttribute("trId") - 1]
    
    const conf = confirm("Are you sure that you want to delete the activity: "+node.label+"?")
    if(!conf){
        return
    }
    
    for(let i = 0; i < nodes.length; i++){
        
        if(nodes[i].id > node.id){
            nodes[i].id--
            nodes[i].label = `#${nodes[i].id}:${nodes[i].activityLabel}`
        }
        for(let j = 0; j < nodes[i].transitions.length; j++){
            if(nodes[i].transitions[j].to === node.id){
                nodes[i].transitions.splice(j,1)
                j--
            }else if(nodes[i].transitions[j].to > node.id){
                nodes[i].transitions[j].to--
            }
        }
        
    }
    
    nodes.splice(node.id-1,1)
    
    lastNode--
    
    if(node.id == 1 && nodes.length>0){
        nodes[0].color = "#dda0a0"
    }
    
   
    for(let i = 0; i < edges.length; i++){
        if(edges[i].from === node.id || edges[i].to === node.id){
            edges.splice(i,1)
            i--
            continue
        }
        if(edges[i].from>node.id)
            edges[i].from--
        if(edges[i].to>node.id)
            edges[i].to--
    }
    
    
    restartBoard()
    
}

document.getElementById("btnCreateActivity").addEventListener("click", createActivity)
document.getElementById("btnUpdateActivity").addEventListener("click", updateActivity)
document.getElementById("btnDeleteActivity").addEventListener("click", deleteActivity)