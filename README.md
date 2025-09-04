# 📘 Aplicação da Força de Arrasto (`applyDrag`)

Este método implementa a **força de arrasto** (*drag force*) que atua sobre um corpo em movimento em um fluido (como ar ou água).  
A força de arrasto é uma força de resistência que se opõe ao movimento e aumenta com o quadrado da velocidade.

---

## 🔬 Fórmula Física

A fórmula clássica do arrasto é:

\[
F_d = \frac{1}{2} \cdot \rho \cdot C_d \cdot A \cdot v^2
\]

Onde:  
- \( F_d \) → força de arrasto  
- \( \rho \) → densidade do fluido  
- \( C_d \) → coeficiente de arrasto (dependente da forma do objeto)  
- \( A \) → área de seção transversal do objeto  
- \( v \) → velocidade do objeto  

A direção dessa força é **oposta** à velocidade.

---

## ⚙️ Adaptação no Código

```js
applyDrag() {
  const speed = this.velocity.magnitude; // módulo da velocidade

  if (speed > 0) {
    const velocityDir = Vec2.normalize(this.velocity); // direção do movimento

    // Cálculo da intensidade da força de arrasto
    const dragMagnitude = 0.5 * this.rho * this.area * this.drag * speed * speed;

    // Vetor força de arrasto (direção oposta à velocidade)
    const dragForce = velocityDir.scale(-dragMagnitude);

    // Conversão da força para aceleração (2ª lei de Newton: F = m·a)
    const accelDrag = dragForce.scale(1 / this.mass);

    // Adição da aceleração de arrasto ao objeto
    this.acceleration.addInPlace(accelDrag);
  }
}
```

---

## 🧩 Passo a Passo do Método

1. **Cálculo da velocidade** → pega a magnitude (módulo) da velocidade.  
2. **Normalização da direção** → obtém a direção unitária do movimento.  
3. **Força de arrasto (magnitude)** → aplica a fórmula física \( 0.5 \cdot \rho \cdot C_d \cdot A \cdot v^2 \).  
4. **Força vetorial de arrasto** → multiplica pela direção oposta à velocidade.  
5. **Conversão para aceleração** → divide pela massa do objeto.  
6. **Aplicação ao sistema** → adiciona essa aceleração ao vetor de aceleração total do corpo.  

---

## 🚀 Observações Importantes

- O método garante que a força só é aplicada se a velocidade for maior que zero.  
- Quanto maior a velocidade, maior o arrasto (cresce quadraticamente com \( v^2 \)).  
- A densidade do fluido (\( \rho \)), a área e o coeficiente de arrasto são **parâmetros ajustáveis**, permitindo simular diferentes condições (ar, água, formas aerodinâmicas, etc).  
- A integração da aceleração final deve ser tratada pelo sistema de movimento do objeto (ex.: atualização da velocidade e posição).  
