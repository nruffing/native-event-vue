describe('useNativeEvent', () => {
  it('successfully adds and removes event listener', () => {
    const inputs = ['input']
    cy.visit('/use-native-event')

    for (const inputId of inputs) {
      // Type in the input to ensure the event listener is added
      const value = 'value to type'
      cy.get(`#${inputId}`).type(value).expectEventAttached('input')
      cy.get(`#${inputId}-value`).should('have.text', value)
    }

    // Navigate to another page to ensure the event listener is removed
    cy.navigateViaRouter('/').then(() => {
      for (const inputId of inputs) {
        cy.expectEventLogged('useNativeEvent | event listener added', inputId, 1)
        cy.expectEventLogged('useNativeEvent | event listener removed', inputId, 1)
      }
    })
  })
})
