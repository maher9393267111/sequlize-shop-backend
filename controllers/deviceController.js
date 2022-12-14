const uuid = require('uuid')
const path = require('path');
const {Device, DeviceInfo, Brand} = require('../models/all')
const ApiError = require('../services/error');

class DeviceController {
    async create(req, res, next) {
        try {
            let {name, price, brandId, typeId, info} = req.body
            console.log('reqBODY----->>>>' , req.body)
            // const {img} = req.files
            // let fileName = uuid.v4() + ".jpg"
            // img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const device = await Device.create({name, price, brandId, typeId});

        //    if (info) {
                console.log('info Condition', info)
              //  info = JSON.parse(info)

                // DeviceInfo.create({
                //             title: info.title,
                //             description: info.description,
                //             deviceId: device.id
                //         })


             await   DeviceInfo.create({...info,deviceId:device.id})


                // info.forEach(i =>
                //     DeviceInfo.create({
                //         title: i.title,
                //         description: i.description,
                //         deviceId: device.id
                //     })
                // )
       //     }


            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message , e))
        }

    }

    async getAll(req, res) {
        let {brandId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let devices;
        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({limit, offset})
        }
        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({where:{brandId},
                include: [{model: Brand}]
                , limit, offset})
        }
        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({where:{typeId}, limit, offset})
        }
        if (brandId && typeId) {
            devices = await Device.findAndCountAll({where:{typeId, brandId}, limit, offset})
        }
        return res.json(devices)
    }

    async getOne(req, res) {
        const {id} = req.params

        const device = await Device.findOne(
            {
                where: {id},
             
                include: [{model: DeviceInfo , as: 'info'},{model:Brand}]} 
        )
        return res.json(device)
    }
}

module.exports = new DeviceController()