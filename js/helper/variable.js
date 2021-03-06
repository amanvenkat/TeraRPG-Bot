var variable =
{
        workBenchId: '170',
        furnaceId: '171',
        anvilId: '173',
        cookingPotId: '350',
        woodId: '179',
        copperOreId: '1',
        ironOreId: '3',
        silverOreId: '5',
        tungstenOreId: '6',
        goldOreId: '7',
        platinumOreId: '8',
        copperBarId: '22',
        ironBarId: '24',
        silverBarId: '26',
        tungstenBarId: '27',
        goldBarId: '28',
        platinumBarId: '30',
        cobweb: '311',
        frostCore: '312',
        sturdyFossil: '313',
        stinger: '314',
        shadowScale: '315',
        tissueSample: '316',
        forbiddenFragment: '317',
        iceBladeId: '305',
        mandibleBladeId: '306',
        bladeGrassId: '307',
        lightsBaneId: '308',
        bloodButchererId: '309',
        nightEdgeId: '310',
        woodenSwordId: '201',
        copperSwordId: '202',
        ironSwordId: '203',
        silverSwordId: '204',
        tungstenSwordId: '205',
        goldSwordId: '206',
        platinumSwordId: '207',
        cookedFish: '342',
        cookedShrimp: '343',
        sashimi: '344',
        seafoodDinner: '345',
        lobsterTail: '346',
        
}
var  materialList = {
        woodenSword:[
                { id: variable.woodId, name: 'platinum bar', quantity: 20 }
        ],
        woodenHelmet:[
                { id: variable.woodId, name: 'platinum bar', quantity: 15 }
        ],
        woodenBreastplate:[
                { id: variable.woodId, name: 'platinum bar', quantity: 25 }
        ],
        woodenGreaves:[
                { id: variable.woodId, name: 'platinum bar', quantity: 20 }
        ],
        copperSword: [
                { id: variable.woodId, name: 'platinum bar', quantity: 2 },
                { id: variable.copperBarId, name: 'platinum bar', quantity: 10 }
        ],
        copperHelmet: [
                { id: variable.copperBarId, name: 'platinum bar', quantity: 15 },
        ],
        copperChainmail: [
                { id: variable.copperBarId, name: 'platinum bar', quantity: 20 },
        ],
        copperGreaves: [
                { id: variable.copperBarId, name: 'platinum bar', quantity: 18 },
        ],
        iceBlade: [
                { id: variable.copperBarId, name: 'platinum bar', quantity: 10 },
                { id: variable.frostCore, name: 'platinum bar', quantity: 10 }
        ],
        frostHelmet: [
                { id: variable.copperBarId, name: 'platinum bar', quantity: 15 },
        ],
        frostBreastplate: [
                { id: variable.copperBarId, name: 'platinum bar', quantity: 20 },
        ],
        frostLeggings: [
                { id: variable.copperBarId, name: 'platinum bar', quantity: 18 },
        ],
        ironSword: [
                { id: variable.woodId, name: 'platinum bar', quantity: 5 },
                { id: variable.ironBarId, name: 'platinum bar', quantity: 7 }
        ],
        ironHelmet: [
                { id: variable.ironBarId, name: 'platinum bar', quantity: 6 },
        ],
        ironChainmail: [
                { id: variable.ironBarId, name: 'platinum bar', quantity: 10 },
        ],
        ironGreaves: [
                { id: variable.ironBarId, name: 'platinum bar', quantity: 5 },
        ],
        mandibleBlade: [
                { id: variable.ironBarId, name: 'platinum bar', quantity: 7 },
                { id: variable.sturdyFossil, name: 'platinum bar', quantity: 10 },
        ],
        fossilHelmet: [
                { id: variable.ironBarId, name: 'platinum bar', quantity: 6 },
                { id: variable.sturdyFossil, name: 'platinum bar', quantity: 2 },
        ],
        fossilPlate: [
                { id: variable.ironBarId, name: 'platinum bar', quantity: 10 },
                { id: variable.sturdyFossil, name: 'platinum bar', quantity: 4 },
        ],
        fossilGreaves: [
                { id: variable.ironBarId, name: 'platinum bar', quantity: 5 },
                { id: variable.sturdyFossil, name: 'platinum bar', quantity: 3 },
        ],
        silverSword: [
                { id: variable.woodId, name: 'platinum bar', quantity: 15 },
                { id: variable.silverBarId, name: 'platinum bar', quantity: 6 }
        ],
        silverHelmet: [
                { id: variable.silverBarId, name: 'platinum bar', quantity: 5 },
        ],
        silverChainmail: [
                { id: variable.silverBarId, name: 'platinum bar', quantity: 9 },
        ],
        silverGreaves: [
                { id: variable.silverBarId, name: 'platinum bar', quantity: 4 },
        ],
        bladeGrass: [
                { id: variable.silverBarId, name: 'platinum bar', quantity: 6 },
                { id: variable.stinger, name: 'platinum bar', quantity: 10 }
        ],
        jungleHat: [
                { id: variable.silverBarId, name: 'platinum bar', quantity: 5 },
                { id: variable.stinger, name: 'platinum bar', quantity: 2 }
        ],
        jungleShirt: [
                { id: variable.silverBarId, name: 'platinum bar', quantity: 9 },
                { id: variable.stinger, name: 'platinum bar', quantity: 5 }
        ],
        junglePants: [
                { id: variable.silverBarId, name: 'platinum bar', quantity: 4 },
                { id: variable.stinger, name: 'platinum bar', quantity: 3 }
        ],
        tungstenSword: [
                { id: variable.woodId, name: 'platinum bar', quantity: 25 },
                { id: variable.tungstenBarId, name: 'platinum bar', quantity: 5 }
        ],
        tungstenHelmet: [
                { id: variable.tungstenBarId, name: 'platinum bar', quantity: 4 }
        ],
        tungstenChainmail: [
                { id: variable.tungstenBarId, name: 'platinum bar', quantity: 8 }
        ],
        tungstenGreaves: [
                { id: variable.tungstenBarId, name: 'platinum bar', quantity: 3 }
        ],
        lightsBane: [
                { id: variable.tungstenBarId, name: 'platinum bar', quantity: 5 },
                { id: variable.shadowScale, name: 'platinum bar', quantity: 10 }
        ],
        shadowHelmet: [
                { id: variable.tungstenBarId, name: 'platinum bar', quantity: 4 },
                { id: variable.shadowScale, name: 'platinum bar', quantity: 2 }
        ],
        shadowScalemail: [
                { id: variable.tungstenBarId, name: 'platinum bar', quantity: 8 },
                { id: variable.shadowScale, name: 'platinum bar', quantity: 4 }
        ],
        shadowGreaves: [
                { id: variable.tungstenBarId, name: 'platinum bar', quantity: 3 },
                { id: variable.shadowScale, name: 'platinum bar', quantity: 3 }
        ],
        goldSword: [
                { id: variable.woodId, name: 'platinum bar', quantity: 35 },
                { id: variable.goldBarId, name: 'platinum bar', quantity: 4 } 
        ],
        goldHelmet: [
                { id: variable.goldBarId, name: 'platinum bar', quantity: 3 } 
        ],
        goldChainmail: [
                { id: variable.goldBarId, name: 'platinum bar', quantity: 7 } 
        ],
        goldGreaves: [
                { id: variable.goldBarId, name: 'platinum bar', quantity: 2 } 
        ],
        bloodButcherer: [
                { id: variable.goldBarId, name: 'platinum bar', quantity: 4 },
                { id: variable.tissueSample, name: 'platinum bar', quantity: 10 }
        ],
        crimsonHelmet: [
                { id: variable.goldBarId, name: 'platinum bar', quantity: 3 },
                { id: variable.tissueSample, name: 'platinum bar', quantity: 2 }
        ],
        crimsonScalemail: [
                { id: variable.goldBarId, name: 'platinum bar', quantity: 7 },
                { id: variable.tissueSample, name: 'platinum bar', quantity: 4 }
        ],
        crimsonGreaves: [
                { id: variable.goldBarId, name: 'platinum bar', quantity: 2 },
                { id: variable.tissueSample, name: 'platinum bar', quantity: 3 }
        ],
        platinumSword: [
                { id: variable.woodId, name: 'platinum bar', quantity: 50 },
                { id: variable.platinumBarId, name: 'platinum bar', quantity: 3 }
        ],
        platinumHelmet: [
                { id: variable.platinumBarId, name: 'platinum bar', quantity: 2 }
        ],
        platinumChainmail: [
                { id: variable.platinumBarId, name: 'platinum bar', quantity: 5 }
        ],
        platinumGreaves: [
                { id: variable.platinumBarId, name: 'platinum bar', quantity: 1 }
        ],
        nightEdge: [
                { id: variable.woodId, name: 'platinum bar', quantity: 1000 },
                { id: variable.iceBladeId, name: 'platinum bar', quantity: 1 },
                { id: variable.mandibleBladeId, name: 'platinum bar', quantity: 1 },
                { id: variable.bladeGrassId, name: 'platinum bar', quantity: 1 },
                { id: variable.lightsBaneId, name: 'platinum bar', quantity: 1 },
                { id: variable.bloodButchererId, name: 'platinum bar', quantity: 1 },
        ],
        // fieryGreatsword: [
        //         { id: variable.woodId, name: 'platinum bar', quantity: 1000 },
        //         // { id: iceBladeId, name: 'platinum bar', quantity: 1 },
        //         // { id: mandibleBladeId, name: 'platinum bar', quantity: 1 },
        //         // { id: bladeGrassId, name: 'platinum bar', quantity: 1 },
        //         // { id: nightEdgeId, name: 'platinum bar', quantity: 1 },
        //         // { id: bloodButchererId, name: 'platinum bar', quantity: 1 },
        // ],
        forbiddenMask: [
                { id: variable.platinumBarId, name: 'platinum bar', quantity: 2 },
                { id: variable.forbiddenFragment, name: 'platinum bar', quantity: 2 }
        ],
        forbiddenRobes: [
                { id: variable.platinumBarId, name: 'platinum bar', quantity: 5 },
                { id: variable.sturdyFossil, name: 'platinum bar', quantity: 4 },
                { id: variable.tissueSample, name: 'platinum bar', quantity: 10 },
                { id: variable.forbiddenFragment, name: 'platinum bar', quantity: 2 }
        ],
        forbiddenTreads: [
                { id: variable.platinumBarId, name: 'platinum bar', quantity: 1 },
                { id: variable.frostCore, name: 'platinum bar', quantity: 4 },
                { id: variable.shadowScale, name: 'platinum bar', quantity: 6 }
        ],

        // COOK
        cookedFish: [
                { id: 351, emoji: ':green_book:', name: 'Cooked Fish Recipes', quantity: 1, required: true },
                { id: 235, emoji: '<:Bass:810034071627497482> ', name: 'bass', quantity: 1, required: false},
                { id: 236, emoji: '<:Atlantic_Cod:810126891885133825> ', name: 'atlantic cod', quantity: 1, required: false},
                { id: 261, emoji: '<:Trout:810126889745383425>', name: 'trout', quantity: 1, required: false},
        ],
        cookedShrimp: [
                { id: 352, emoji: ':blue_book:', name: 'Cooked Shrimp Recipes', quantity: 1, required: true },
                { id: 235, emoji: '<:Shrimp:810126890190897163>', name:'shrimp', quantity: 1, required: false},
        ],
        seafoodDinner: [
                { id: 354, emoji: ':orange_book:', name:'Seafood Dinner Recipes', quantity: 1, required: true },
                { id: 237, emoji: '<:Armored_Cavefish:810126891926421551>', name:'Armored Cavefish', quantity: 2, required: false},
                { id: 239, emoji: '<:Chaos_Fish:810126891725619201>', name:'Chaos Fish', quantity: 2, required: false},
                { id: 240, emoji: '<:Crimson_Tigerfish:810126891724963841>', name:'Crimson Tiger Fish', quantity: 2, required: false},
                { id: 241, emoji: '<:Damselfish:810126891570823170>', name:'Damselfish', quantity: 2, required: false},
                { id: 242, emoji: '<:Double_Cod:810126891742789632>', name:'Double Cod', quantity: 2, required: false},
                { id: 243, emoji: '<:Ebonkoi:810126891309596703>', name:'Ebon Koi', quantity: 2, required: false},
                { id: 244, emoji: '<:Flarefin_Koi:810126891121246230>', name:'Flarefin Koi', quantity: 2, required: false},
                { id: 246, emoji: '<:Frost_Minnow:810126891403051018>', name:'Frost Minnow', quantity: 2, required: false},
                { id: 254, emoji: '<:Prismite:810126890945871882>', name:'Prismite', quantity: 2, required: false},
                { id: 249, emoji: '<:Hemopiranha:810126890785701931>', name:'Hemopiranha', quantity: 2, required: false},
                { id: 250, emoji: '<:Neon_Tetra:810126890903142401>', name:'Neon Tetra', quantity: 2, required: false},
                { id: 251, emoji: '<:Obsidifish:810126891205394433>', name:'Obsidifish', quantity: 2, required: false},
                { id: 253, emoji: '<:Princess_Fish:810126890517921813>', name:'Pricess Fish', quantity: 2, required: false},
                { id: 254, emoji: '<:Prismite:810126890945871882>', name:'Prismite', quantity: 2, required: false},
                { id: 259, emoji: '<:Specular_Fish:810126890148954123>', name:'Specular Fish', quantity: 2, required: false},
                { id: 260, emoji: '<:Stinkfish:810126890123526164>', name:'Stinkifish', quantity: 2, required: false},
                { id: 263, emoji: '<:Variegated_Lardfish:810126890051960882>', name:'Variegated Lardfish', quantity: 2, required: false},
        ],
        sashimi: [
                { id: 353, emoji: ':blue_book:', name:'Sashimi Recipes', quantity: 1, required: true },
                { id: 245, emoji: '<:Flounder:810126891465179166> ', name:'Flounder', quantity: 1, required: false},
                { id: 255, emoji: '<:Red_Snapper:810126890765385778>', name:'Red Snapper', quantity: 1, required: false},
                { id: 262, emoji: '<:Tuna:810126890173202442>', name:'Tuna', quantity: 1, required: false},
        ],
        lobsterTail: [
                { id: 355, emoji: ':blue_book:', name:'Lobster Tail Recipes', quantity: 1, required: true },
                { id: 256, emoji: '<:Rock_Lobster:810126890455138304>', name:'Rock Lobster', quantity: 1, required: false},
        ],
        // BAR
        copperBar: [
                { id: 1, name: 'copper ore', quantity: 6 },
                { id: variable.woodId, name: 'wood', quantity: 3 },
        ],
        ironBar: [
                { id: 3, name: 'iron ore', quantity: 6 },
                { id: variable.woodId, name: 'wood', quantity: 7 },
        ],
        silverBar: [
                { id: 5, name: 'silver ore', quantity: 8 },      
                { id: variable.woodId, name: 'wood', quantity: 10 },
        ],
        tungstenBar: [
                { id: 6, name: 'tungsten ore', quantity: 8 },      
                { id: variable.woodId, name: 'wood', quantity: 15 },
        ],
        goldBar: [
                { id: 7, name: 'gold ore', quantity: 9 },      
                { id: variable.woodId, name: 'wood', quantity: 20 },
        ],
        platinumBar: [
                { id: 8, name: 'platinum ore', quantity: 9 },     
                { id: variable.woodId, name: 'wood', quantity: 25 },  
        ],

        cookingPot: [
                { id: variable.ironBarId, name: 'iron bar', quantity: 10 },     
                { id: variable.woodId, name: 'wood', quantity: 15 },     
        ]
}
var materialUpgradeTool= {
        ironPickaxe: [ 
                {id:variable.ironBarId, name: 'bar', quantity: 25},
                {id:variable.woodId, name: 'wood', quantity: 15}
        ],
        silverPickaxe: [ 
                {id:variable.silverBarId, name: 'bar', quantity: 20},
                {id:variable.woodId, name: 'wood', quantity: 20}
        ],
        tungstenPickaxe: [ 
                {id:variable.tungstenBarId, name: 'bar', quantity: 15},
                {id:variable.woodId, name: 'wood', quantity: 35}
        ],
        goldPickaxe: [ 
                {id:variable.goldBarId, name: 'bar', quantity: 10},
                {id:variable.woodId, name: 'wood', quantity: 50}
        ],
        platinumPickaxe: [ 
                {id:variable.platinumBarId, name: 'bar', quantity: 5},
                {id:variable.woodId, name: 'wood', quantity: 75}
        ],
}
var emojiName = {
        workBench: '<:Work_Bench:804145756918775828> **work bench**',
        anvil: '<:Iron_Anvil:804145327435284500> **anvil**',
        furnace: '<:Furnace:804145327513796688> **furnace**',
        copperBar: '<:Copper_Bar:803907956478836817> **copper bar**',
        ironBar: '<:Iron_Bar:803907956528906241> **iron bar**',
        silverBar: '<:Silver_Bar:803907956663910410> **silver bar**',
        tungstenBar: '<:Tungsten_Bar:803907956252344331> **tungsten bar**',
        goldBar: '<:Gold_Bar:803907956424441856> **gold bar**',
        platinumBar: '<:Platinum_Bar:803907956327317524> **platinum bar**',
}

var limitedTimeUse = {
        luckyCoinEmoji: '<:Lucky_Coin:833189137179344897>',
        dicountCardEmoji: '<:Discount_Card:833189137141334036>',
        luckyCoinId: '319',
        dicountCardId: '320'
}

var priceList = {
        apricot : {
                id: '323',
                price: 30
        },
        apple : {
                id: '322',
                price: 40
        },
        applePie : {
                id: '339',
                price: 400
        },
        cookie : {
                id: '341',
                price: 150
        },
        apprenticeBait : {
                id: '271',
                price: 75
        },
        healingPotion : {
                id: '266',
                price: 3000
        },
        cookedFishRecipes: {
                id: '351',
                price: 2400
        },
        blacksmithBlessing: {
                id: '356',
                price: 2,
                type: 2,
        }
}

var cooldown = {
        explore: 60/2,
        work: 300/2,
        vote: 43200,
        hourly: 3600,
        daily: 86400,
        weekly: 604800,
        fish: 5400/2,
        junken: 3600/2,
        dungeon: 43200/2,
        expedition: 1800/2,
        quest: 10800,
}


export {
        cooldown,
        variable,
        materialList,
        materialUpgradeTool,
        emojiName,
        limitedTimeUse,
        priceList
}