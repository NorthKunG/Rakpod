class NotifyRegistryPrototype {
    // uuid: string
    line_code_id: string
    acc_token: string
    notify_type: string;
    target: string
    targetType: string
    is_active: number
    constructor(data: any) {
        // this.uuid = data['stationid']
        this.line_code_id = data['line_code_id']
        this.acc_token = data['acc_token']
        this.notify_type = data['notify_type'] == undefined || data['notify_type'] == null ? "warning" : data['notify_type'];
        this.target = data['target']
        this.targetType = data['targetType']
        this.is_active = data['is_active']
    }
}

export { NotifyRegistryPrototype }