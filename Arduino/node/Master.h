/**
 * Check if master node and add master tasks
 * @returns {void}
 */
void checkIfMaster() {
    if (mesh.getNodeId() == C_MASTER_NODE_ID) {
        role = "MASTER";
        
        // Task
        mesh.scheduler.addTask(taskSerialParser);
        mesh.scheduler.addTask(taskProcessQueue);
        taskSerialParser.enableDelayed();
    }
}