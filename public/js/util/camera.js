export function attachCamera(attachedObject1, attachedObject2, offsetX, fixedY, zoom) {
    onUpdate(() => {
        camPos((attachedObject1.pos.x + attachedObject2.pos.x) / 2 + offsetX, fixedY)
        camScale(zoom, zoom)
    })
}