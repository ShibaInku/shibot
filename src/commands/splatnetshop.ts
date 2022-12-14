import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {fetchShop} from "../splatoon3.ink-data";
import type {shop} from "../Typings/shop";
import {pagination, StylesButton, TypesButtons} from '@devraelfreeze/discordjs-pagination';


function createPickupBrandEmbed(shop: shop, index: number) {
    return new EmbedBuilder()
        .setAuthor({
            name: shop.pickupBrand.brand.name,
            iconURL: shop.pickupBrand.brandGears[index]!.gear.brand.image.url
        })
        .setColor('#e4000f')
        .setTitle(`Daily Drop: ${shop.pickupBrand.brandGears[index]!.gear.name}`)
        .setDescription(`${shop.pickupBrand.brandGears[index]!.gear.name}'s primary ability is ${shop.pickupBrand.brandGears[index]!.gear.primaryGearPower.name}.`)
        .setImage(`${shop.pickupBrand.brandGears[index]!.gear.image.url}`)
        .setThumbnail(shop.pickupBrand.brandGears[index]!.gear.primaryGearPower.image.url)
        .addFields({
            name: 'Sale Ends:',
            value: `<t:${(new Date(shop.pickupBrand.saleEndTime).getTime()) / 1000}:R>`,
            inline: true
        })
        .addFields({name: 'Price:', value: `${shop.pickupBrand.brandGears[index]!.price} coins`, inline: true})
        .addFields({
            name: 'Additional Gear Slots:',
            value: `${shop.pickupBrand.brandGears[index]!.gear.name} has ***${shop.pickupBrand.brandGears[index]!.gear.additionalGearPowers.length} additional gear slots.***`,
            inline: false
        })
}

function createLimitedGearEmbed(shop: shop, index: number) {
    return new EmbedBuilder()
        .setAuthor({
            name: shop.limitedGears[index]!.gear.brand.name,
            iconURL: shop.limitedGears[index]!.gear.brand.image.url
        })
        .setColor('#eaff06')
        .setTitle(`Limited Time Gear: ${shop.limitedGears[index]!.gear.name}`)
        .setDescription(`${shop.limitedGears[index]!.gear.name}'s primary ability is ${shop.limitedGears[index]!.gear.primaryGearPower.name}.`)
        .setImage(`${shop.limitedGears[index]!.gear.image.url}`)
        .setThumbnail(shop.limitedGears[index]!.gear.primaryGearPower.image.url)
        .addFields({
            name: 'Sale Ends:',
            value: `<t:${(new Date(shop.limitedGears[index]!.saleEndTime).getTime()) / 1000}:R>`,
            inline: true
        })
        .addFields({name: 'Price:', value: `${shop.limitedGears[index]!.price} coins`, inline: true})
        .addFields({
            name: 'Additional Gear Slots:',
            value: `${shop.limitedGears[index]!.gear.name} has ***${shop.limitedGears[index]!.gear.additionalGearPowers.length} additional gear slots.***`,
            inline: false
        })
}

function createEmbeds(shop: shop) {
    let allEmbeds = [
        new EmbedBuilder()
            .setAuthor({
                name: shop.pickupBrand.brand.name,
                iconURL: shop.pickupBrand.brandGears[0].gear.brand.image.url
            })
            .setColor('#e4000f')
            .setTitle('The Daily Drop')
            .setDescription(`Today's featured gear brand is ${shop.pickupBrand.brand.name}.`)
            .setImage(shop.pickupBrand.image.url)
            .setThumbnail(shop.pickupBrand.brand.usualGearPower.image.url)
            .addFields({
                name: 'Sale Ends:',
                value: `<t:${(new Date(shop.pickupBrand.saleEndTime).getTime()) / 1000}:R>`
            })
            .addFields({
                name: 'Usual Gear Power',
                value: `${shop.pickupBrand.brand.name}'s usual gear power is ***${shop.pickupBrand.brand.usualGearPower.name}*** which ***${shop.pickupBrand.brand.usualGearPower.desc.toLowerCase()}***`
            }),
        createPickupBrandEmbed(shop, 0),
        createPickupBrandEmbed(shop, 1),
        createPickupBrandEmbed(shop, 2)];

    let limitedEmbeds = [
        createLimitedGearEmbed(shop, 0),
        createLimitedGearEmbed(shop, 1),
        createLimitedGearEmbed(shop, 2),
        createLimitedGearEmbed(shop, 3),
        createLimitedGearEmbed(shop, 4),
        createLimitedGearEmbed(shop, 5)]
        // @ts-ignore
        .sort((a, b) => parseInt(a.data.fields[0].value.trim('<t:R>')) - parseInt(b.data.fields[0].value.trim('<t:R>')));
    return allEmbeds.concat(limitedEmbeds);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('splatnetshop')
        .setDescription('Provides information about the current SplatNet Shop!'),
    async execute(interaction: ChatInputCommandInteraction) {
        let shop = await fetchShop();
        await interaction.reply('Creating shop embed...');
        await pagination({
            // @ts-ignore
            embeds: createEmbeds(shop), // Array of embeds objects
            // @ts-ignore
            author: interaction.member.user,
            interaction: interaction,
            ephemeral: false,
            time: 60000, // 40 seconds
            disableButtons: false, // Remove buttons after timeout
            fastSkip: true,
            pageTravel: false,
            buttons: [
                {
                    value: TypesButtons.previous,
                    label: 'Previous Page',
                    style: StylesButton.Danger
                },
                {
                    value: TypesButtons.next,
                    label: 'Next Page',
                    style: StylesButton.Success
                }
            ]
        });
        await interaction.editReply(`Viewing the SplatNet Shop!`)
    }
}








