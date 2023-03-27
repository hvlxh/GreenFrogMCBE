const Block = require("./Block");

class NetherBrickWall extends Block {
    getRuntimeId() {
        return 3362
    }

    getName() {
        return "nether_brick_wall"
    }
}

module.exports = NetherBrickWall;