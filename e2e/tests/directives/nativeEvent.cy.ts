describe('useNativeEvent', () => {
  it('successfully adds and removes event listener', () => {
    cy.visit('/v-native-event')
    cy.get('input').type('Hello World')
  })
})
