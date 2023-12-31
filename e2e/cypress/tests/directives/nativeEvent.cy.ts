describe('useNativeEvent', () => {
  it('successfully adds and removes event listener', () => {
    cy.visit('/v-native-event')

    // Type in the input to ensure the event listener is added
    const value = 'value to type'
    cy.get('input').type(value).expectEventAttached('input')
    cy.get('#input-value').should('have.text', value)

    // Navigate to another page to ensure the event listener is removed
    cy.navigateViaRouter('/').then(() => {
      cy.expectEventLogged('native-event | event listener added', 'input', 1)
      cy.expectEventLogged('native-event | event listener removed', 'input', 1)
    })
  })
})
